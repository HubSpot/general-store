/**
 * @flow
 */

var compare = require('immutable-is');

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

export function hasPropsChanged(
  oldProps: Object,
  nextProps: Object
): bool {
  return !shallowEqual(
    compareKey,
    oldProps,
    nextProps
  );
}

export function hasStateChanged(
  stores: Object,
  oldState: Object,
  nextState: Object
): bool {
  return !shallowEqual(
    (key, objA, objB) => {
      return (
        stores.hasOwnProperty(key) || // if the value is a store, ignore it
        compare(objA[key], objB[key])
      );
    },
    oldState,
    nextState
  );
}
