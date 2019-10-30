import { DependencyIndexEntry, DependencyMap } from './DependencyMap';
import { Dispatcher } from 'flux';
import { makeDisplayName, focuser } from './BuildComponent';
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
import * as React from 'react';
import { Component, ComponentType } from 'react';
import hoistStatics from 'hoist-non-react-statics';

export default function connect(
  dependencies: DependencyMap,
  dispatcher: Dispatcher<any> = getDispatcherInstance()
): Function {
  enforceDispatcher(dispatcher);

  const dependencyIndex = makeDependencyIndex(dependencies);

  return function connector<Props extends {}>(
    BaseComponent: ComponentType<Props>
  ): ComponentType<Props> {
    class ConnectedComponent extends Component<Props, any> {
      static defaultProps?: Partial<Props> = BaseComponent.defaultProps;
      static dependencies: DependencyMap = dependencies;
      static displayName = makeDisplayName('Connected', BaseComponent);
      static propTypes: any = dependencyPropTypes(
        dependencies,
        // eslint-disable-next-line react-app/react/forbid-foreign-prop-types
        BaseComponent.propTypes
      );
      static WrappedComponent: ComponentType<Props> = BaseComponent;

      dispatchToken?: string;
      state: any = {};
      wrappedInstance?: HTMLElement = null;

      UNSAFE_componentWillMount() {
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

      UNSAFE_componentWillReceiveProps(nextProps: Object) {
        this.setState(
          calculateForPropsChange(dependencies, nextProps, this.state)
        );
      }

      componentWillUnmount() {
        const dispatchToken = this.dispatchToken;
        if (dispatcher && dispatchToken) {
          this.dispatchToken = null;
          dispatcher.unregister(dispatchToken);
        }
      }

      focus =
        typeof BaseComponent.prototype.focus === 'function'
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
