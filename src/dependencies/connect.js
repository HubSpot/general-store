/* @flow */
import type { DependencyIndexEntry, DependencyMap } from './DependencyMap';
import type { Dispatcher } from 'flux';
import {
  makeDisplayName,
  focuser,
} from './BuildComponent';
import {
  calculateInitial,
  calculateForDispatch,
  calculateForPropsChange,
  dependencyPropTypes,
  makeDependencyIndex,
} from '../dependencies/DependencyMap';
import { handleDispatch } from './Dispatch';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { enforceDispatcher } from '../dispatcher/DispatcherInterface';
import React, { Component } from 'react';
import hoistStatics from 'hoist-non-react-statics'

export default function connect(
  dependencies: DependencyMap,
  dispatcher: ?Dispatcher = getDispatcherInstance()
): Function {
  enforceDispatcher(dispatcher);

  const dependencyIndex = makeDependencyIndex(dependencies);

  /* global ReactClass */
  return function connector(BaseComponent: ReactClass<*>): ReactClass<*> {
    class ConnectedComponent extends Component {
      static defaultProps: ?Object = BaseComponent.defaultProps;
      static dependencies: DependencyMap = dependencies;
      static displayName = makeDisplayName('Connected', BaseComponent);
      static propTypes = dependencyPropTypes(
        dependencies,
        BaseComponent.propTypes
      );
      static WrappedComponent: ReactClass<*> = BaseComponent;

      /* eslint react/sort-comp: 0 */
      dispatchToken: ?string;
      state: Object = {};
      wrappedInstance: ?Object = null;

      componentWillMount() {
        if (dispatcher) {
          this.dispatchToken = dispatcher.register(
            handleDispatch.bind(
              null,
              dispatcher,
              dependencyIndex,
              this.handleDispatch.bind(this)
            )
          );
        }
        this.setState(calculateInitial(dependencies, this.props, this.state));
      }

      componentWillReceiveProps(nextProps: Object): void {
        this.setState(
          calculateForPropsChange(dependencies, nextProps, this.state)
        );
      }

      componentWillUnmount(): void {
        const dispatchToken = this.dispatchToken;
        if (dispatcher && dispatchToken) {
          this.dispatchToken = null;
          dispatcher.unregister(dispatchToken);
        }
      }

      focus = typeof BaseComponent.prototype.focus === 'function'
        ? (...args) => focuser(this, ...args)
        : undefined;

      handleDispatch(entry: DependencyIndexEntry) {
        this.setState(
          calculateForDispatch(dependencies, entry, this.props, this.state)
        );
      }

      setWrappedInstance = ref => {
        this.wrappedInstance = ref;
      };

      render() {
        return (
          <BaseComponent
            {...this.props}
            {...this.state}
            ref={this.setWrappedInstance}
          />
        );
      }
    }

    return hoistStatics(ConnectedComponent, BaseComponent);
  };
}
