/* @flow */
import type { DependencyIndexEntry, DependencyMap } from './DependencyMap';
import type { Dispatcher } from 'flux';
import {
  calculateInitial,
  calculateForDispatch,
  calculateForPropsChange,
  dependencyPropTypes,
  makeDependencyIndex,
} from '../dependencies/DependencyMap';
import { handleDispatch } from './Dispatch';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { isDispatcher } from '../dispatcher/DispatcherInterface';
import invariant from 'invariant';
import React, { Component } from 'react';


function transferStaticProperties(
  fromClass: Object,
  // By setting the type to Object, I'm doing a little dance around the type
  // checker... I fully expect this to break after a future flow upgrade.
  toClass: Object
) {
  Object.keys(fromClass).forEach((staticField) => {
    toClass[staticField] = fromClass[staticField];
  });
}

export default function connect(
  dependencies: DependencyMap,
  dispatcher: ?Dispatcher = getDispatcherInstance()
): Function {
  invariant(
    isDispatcher(dispatcher),
    'expected `dispatcher` to be a `Flux.Dispatcher` but got `%s`',
    dispatcher
  );

  const dependencyIndex = makeDependencyIndex(dependencies);

  /* global ReactClass */
  return function connector(BaseComponent: ReactClass): ReactClass {
    class ConnectedComponent extends Component {
      /* eslint react/sort-comp: 0 */
      dispatchToken: ?string;
      state: Object;

      constructor() {
        super();
        this.state = {};
      }

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
        this.setState(
          calculateInitial(dependencies, this.props, this.state)
        );
      }

      componentWillReceiveProps(nextProps: Object): void {
        this.setState(
          calculateForPropsChange(dependencies, nextProps)
        );
      }

      componentWillUnmount(): void {
        if (dispatcher && this.dispatchToken) {
          dispatcher.unregister(this.dispatchToken);
        }
      }

      handleDispatch(entry: DependencyIndexEntry) {
        this.setState(
          calculateForDispatch(dependencies, entry, this.props, this.state)
        );
      }

      render() {
        return (
          <BaseComponent
            {...this.props}
            {...this.state}
          />
        );
      }
    }

    transferStaticProperties(BaseComponent, ConnectedComponent);
    ConnectedComponent.displayName = `Connected(${BaseComponent.displayName})`;
    ConnectedComponent.propTypes = dependencyPropTypes(dependencies);

    return ConnectedComponent;
  };
}
