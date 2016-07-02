/**
 * @flow
 */
import {dependencies} from './StoreDependencyMixinFields.js';
import {applyDependencies} from './StoreDependencyMixinInitialize.js';
import {getDependencyState} from './StoreDependencyMixinState.js';
import {
  hasPropsChanged,
  hasStateChanged,
} from './StoreDependencyMixinTransitions.js';

import DispatcherInstance from '../dispatcher/DispatcherInstance';

export default function StoreDependencyMixin(
  dependencyMap: Object,
  overrideDispatcher: ?Object
): Object {

  const dispatcher = overrideDispatcher || DispatcherInstance.get();
  const actionTypes = {};
  const actionDeps = {};
  const actionFields = {};

  function waitForStores(actionType) {
    if (dispatcher) {
      dispatcher.waitFor(actionDeps[actionType]);
    }
  }

  let dispatcherToken;

  const mixin = {
    propTypes: {},

    componentWillMount(): void {
      if (dispatcher) {
        dispatcherToken = dispatcher.register((payload) => {
          const actionType = payload.actionType || payload.type;
          if (actionTypes[actionType]) {
            waitForStores(actionType);
          }
        });
      }
    },

    componentWillReceiveProps(nextProps): void {
      if (!hasPropsChanged(this.props, nextProps)) {
        return;
      }
      this.setState(
        getDependencyState(this, nextProps, this.state, null)
      );
    },

    componentWillUnmount(): void {
      if (dispatcher) {
        dispatcher.unregister(dispatcherToken);
      }
    },

    componentDidUpdate(oldProps, oldState): void {
      if (!hasStateChanged(dependencies(this), oldState, this.state)) {
        return;
      }
      this.setState(
        getDependencyState(this, this.props, this.state, null)
      );
    },

    getInitialState(): Object {
      applyDependencies(this, dependencyMap);
      return getDependencyState(
        this,
        this.props,
        this.state,
        Object.keys(dependencyMap)
      );
    },
  };

  if (process.env.NODE_ENV !== 'production') {
    mixin.propTypes = getPropTypes(dependencyMap);
  }

  return mixin;
}
