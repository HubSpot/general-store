/**
 * @flow
 */

var StoreFacade = require('./StoreFacade.js');

type derefingFunction = (
  props: Object,
  state: Object,
  stores: Array<StoreFacade>
) => any;

type CompoundStoreDependency = {
  stores: Array<StoreFacade>;
  deref: derefingFunction;
};

type StoreDependencies = {
  [key:string]: StoreFacade | CompoundStoreDependency;
};

function defaultDeref(
  _,
  _,
  stores: Array<StoreFacade>
): any {
  return stores[0].get();
}

function extractDeref(
  dependencies: StoreDependencies,
  key: string
): derefingFunction {
  var dependency = dependencies[key];
  if (dependency instanceof StoreFacade) {
    return defaultDeref;
  }
  if (process.env.NODE_ENV !== 'production') {
    if (typeof dependency.deref !== 'function') {
      throw new Error(
        'StoreDependencyDefinition: you must specify a deref' +
          ' function for "' + key + '"'
      );
    }
  }
  return dependency.deref;
}

function extractStores(
  dependencies: StoreDependencies,
  key: string
): Array<StoreFacade> {
  var dependency = dependencies[key];
  if (dependency instanceof StoreFacade) {
    return [dependency];
  }
  if (process.env.NODE_ENV !== 'production') {
    if (!Array.isArray(dependency.stores) || !dependency.stores.length) {
      throw new Error(
        'StoreDependencyDefinition: you must specify a stores' +
          ' array with at least one store for "' + key + '"'
      );
    }
  }
  return dependency.stores;
}

class StoreDependencyDefinition {

  _derefs: {[key:string]: derefingFunction};
  _stores: {[key:string]: Array<StoreFacade>};

  constructor(dependencyMap: StoreDependencies) {
    this._derefs = {};
    this._stores = {};
    var dependency;
    for (var key in dependencyMap) {
      dependency = dependencyMap[key];
      this._derefs[key] = extractDeref(dependencyMap, key);
      this._stores[key] = extractStores(dependencyMap, key);
    }
  }

  _derefStore(
    key: string,
    props: Object,
    state: Object
  ): any {
    return this._derefs[key](
      props,
      state,
      this._stores[key]
    );
  }

  getState(
    props: Object,
    state: Object
  ): Object {
    var updates = {};
    for(var key in this._stores) {
      updates[key] = this._derefStore(key, props, state);
    }
    return updates;
  }

  getStateField(
    key: string,
    props: Object,
    state: Object
  ): Object {
    var update = {};
    update[key] = this._derefStore(key, props, state);
    return update;
  }

  getStores(): {[key:string]: Array<StoreFacade>} {
    return this._stores;
  }

};

module.exports = StoreDependencyDefinition;
