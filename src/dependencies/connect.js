/* @flow */
import type { DependencyMap } from './DependencyMap';
import {
  calculateInitial,
  calculateForDispatch,
  calculateForPropsChange,
  dependencyPropTypes,
  makeDependencyIndex,
} from '../dependencies/DependencyMap';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { Component } from 'react';

export default function connect(
  dependencies: DependencyMap,
  dispatcher: ?Dispatcher = getDispatcherInstance()
) {
  const dependencyIndex = makeDependencyIndex(dependencies);

  return function connector(BaseComponent: Component) {
    class ConnectedComponent extends Component {
      componentWillMount() {
        if (dispatcher) {
          this.__dispatchToken = dispatcher.register((payload) => {
            const actionType = payload.actionType || payload.type;
            if (!dependencyIndex[actionType]) {
              return;
            }
            const entry = dependencyIndex[actionType];
            waitForStores(dispatcher, Object.keys(entry.dispatchTokens));
            this.setState(
              calculateForDispatch(dependencies, entry, this.props, this.state)
            );
          });
        }
        this.setState(
          calculateInitial(dependencies, this.props, this.state)
        );
      },

      render() {
        return (
          <BaseComponent
            {...this.props}
            {...this.state}
          />
        )
      }
    }

    return ConnectedComponent;
  }
}
