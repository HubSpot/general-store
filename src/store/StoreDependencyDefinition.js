/**
 * @flow
 */

var StoreFacade = require('./StoreFacade.js');

var invariant = require('../invariant.js');

var HINT_LINK =
  'Learn more about defining fields with the StoreDependencyMixin:' +
  ' https://github.com/HubSpot/general-store#react';

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
  field: string
): derefingFunction {
  var dependency = dependencies[field];
  if (dependency instanceof StoreFacade) {
    return defaultDeref;
  }
  if (process.env.NODE_ENV !== 'production') {
    invariant(
      typeof dependency.deref === 'function',
      'StoreDependencyDefinition: the compound field "%s" does not have' +
      ' a `deref` function. Provide one, or make it a simple field instead. %s',
      field,
      HINT_LINK
    );
  }
  return dependency.deref;
}

function extractStores(
  dependencies: StoreDependencies,
  field: string
): Array<StoreFacade> {
  var dependency = dependencies[field];
  if (dependency instanceof StoreFacade) {
    return [dependency];
  }
  if (process.env.NODE_ENV !== 'production') {
    invariant(
      Array.isArray(dependency.stores) && dependency.stores.length,
      'StoreDependencyDefinition: the `stores` property on the compound field' +
      ' "%s" must be an array of Stores with at least one Store. %s',
      HINT_LINK
    )
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
    for (var field in dependencyMap) {
      dependency = dependencyMap[field];
      this._derefs[field] = extractDeref(dependencyMap, field);
      this._stores[field] = extractStores(dependencyMap, field);
    }
  }

  _derefStore(
    field: string,
    props: Object,
    state: Object
  ): any {
    return this._derefs[field](
      props,
      state,
      this._stores[field]
    );
  }

  getState(
    props: Object,
    state: Object
  ): Object {
    var updates = {};
    for(var field in this._stores) {
      updates[field] = this._derefStore(field, props, state);
    }
    return updates;
  }

  getStateField(
    field: string,
    props: Object,
    state: Object
  ): Object {
    var update = {};
    update[field] = this._derefStore(field, props, state);
    return update;
  }

  getStores(): {[key:string]: Array<StoreFacade>} {
    return this._stores;
  }

};

module.exports = StoreDependencyDefinition;
