// @flow
import {
  makeDisplayName,
  focuser,
  transferNonReactStatics,
} from './BuildComponent';
import connect from './connect';
import type { DependencyMap } from './DependencyMap';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import type { Dispatcher } from 'flux';
import React, { Component, PropTypes } from 'react';

/* global ReactClass */
function connector(
  defaultInitialState: Object,
  dependencies: DependencyMap,
  depConnector: (BaseComponent: ReactClass<*>) => ReactClass<*>,
  BaseComponent: ReactClass<*>
) {
  const ConnectedComponent = depConnector(BaseComponent);
  const {
    setState: setStateType,
    state: stateType,
    ...transferrablePropTypes
  } = ConnectedComponent.propTypes;
  class ConnectedComponentWithState extends Component {
    static displayName = makeDisplayName('Stateful', ConnectedComponent);
    static propTypes = {
      ...transferrablePropTypes,
      initialState: PropTypes.object,
    };
    static WrappedComponent = BaseComponent;

    state = this.props.initialState || defaultInitialState;
    wrappedInstance: ?Object;

    boundSetState = this.setState.bind(this);

    focus = typeof BaseComponent.prototype.focus === 'function'
      ? (...args) => focuser(this, ...args)
      : undefined;

    setWrappedInstance = ref => {
      this.wrappedInstance = ref;
    };

    render() {
      const { initialState, ...props } = this.props;
      return (
        <ConnectedComponent
          {...props}
          initialState={initialState || defaultInitialState}
          ref={this.setWrappedInstance}
          setState={this.boundSetState}
          state={this.state}
        />
      );
    }
  }

  transferNonReactStatics(ConnectedComponent, ConnectedComponentWithState);

  return ConnectedComponentWithState;
}

export default function connectWithState(
  defaultInitialState: Object = {},
  dependencies: DependencyMap,
  dispatcher: ?Dispatcher = getDispatcherInstance()
) {
  return connector.bind(
    null,
    defaultInitialState,
    dependencies,
    connect(dependencies, dispatcher)
  );
}
