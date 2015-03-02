/**
 * @flow
 */

var StoreDependencyMixinTransitions = {
  hasPropsChanged(
    oldProps: Object,
    nextProps: Object
  ): bool {
    return Object
      .keys(nextProps)
      .some(key => oldProps[key] !== nextProps[key]);
  },

  hasStateChanged(
    stores: Object,
    oldState: Object,
    nextState: Object
  ): bool {
    return Object
      .keys(nextState)
      .some(
        key => !stores.hasOwnProperty(key) && oldState[key] !== nextState[key]
      );
  },

  mergeState(state: Object, updates: Object): Object {
    var merged = {};
    for (var stateKey in state) {
      merged[stateKey] = state[stateKey];
    }
    for (var updatesKey in updates) {
      merged[updatesKey] = updates[updatesKey];
    }
    return merged;
  }
};

module.exports = StoreDependencyMixinTransitions;
