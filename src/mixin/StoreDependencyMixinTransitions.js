/**
 * @flow
 */

var compare = (window.Immutable && typeof window.Immutable.is === 'function') ?
  window.Immutable.is :
  function(a, b) {return a === b;};

function compareKey(key, objA, objB) {
  return compare(objA[key], objB[key]);
}

function shallowEqual(
  is: (key: string, objA: Object, objB: Object) => bool,
  objA: Object,
  objB: Object
): bool {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || !is(key, objA, objB))) {
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

var StoreDependencyMixinTransitions = {
  hasPropsChanged(
    oldProps: Object,
    nextProps: Object
  ): bool {
    return !shallowEqual(
      compareKey,
      oldProps,
      nextProps
    );
  },

  hasStateChanged(
    stores: Object,
    oldState: Object,
    nextState: Object
  ): bool {
    return !shallowEqual(
      (key, objA, objB) => {
        return ( // if the value is a store, ignore it
          stores.hasOwnProperty(key) ||
          compare(objA[key], objB[key])
        );
      },
      oldState,
      nextState
    );
  }
};

module.exports = StoreDependencyMixinTransitions;
