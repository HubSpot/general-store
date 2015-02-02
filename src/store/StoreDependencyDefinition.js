/**
 * @flow
 */

var StoreFacade = require('./StoreFacade.js');

type derefingFunction = (
  store: StoreFacade,
  props: Object,
  state: Object
) => any;

type StoreDependencyWithDeref = {
  store: StoreFacade;
  deref: derefingFunction;
};

type StoreDependencies = {
  [key:string]: StoreFacade | StoreDependencyWithDeref;
};

function defaultDeref(
  store: StoreFacade
): any {
  return store.get();
}

class StoreDependencyDefinition {

  _derefs: {[key:string]: derefingFunction};
  _stores: {[key:string]: StoreFacade};

  constructor(dependencyMap: StoreDependencies) {
    this._derefs = {};
    this._stores = {};
    Object.keys(dependencyMap).forEach(key => {
      if (dependencyMap[key] instanceof StoreFacade) {
        this._derefs[key] = defaultDeref;
        this._stores[key] = dependencyMap[key];
      } else {
        this._derefs[key] = dependencyMap[key].deref || defaultDeref;
        this._stores[key] = dependencyMap[key].store;
      }
    });
  }

  _derefStore(
    key: string,
    props: Object,
    state: Object
  ): any {
    return this._derefs[key](
      this._stores[key],
      props,
      state
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

  getStores(): {[key:string]: StoreFacade} {
    return this._stores;
  }

};

module.exports = StoreDependencyDefinition;
