/**
 * @flow
 */

var StoreFacade = require('../store/StoreFacade.js');

var invariant = require('../invariant.js');
var {dependencies, storeFields, stores} = require('./StoreDependencyMixinFields.js');

function defaultDeref(
  _,
  _,
  stores: Array<StoreFacade>
): any {
  return stores[0].get();
}

var StoreDependencyMixinInitialize = {
  applyDependencies(
    component: Object,
    dependencyMap: Object
  ): void {
    var componentDependencies = dependencies(component);
    var componentStoreFields = storeFields(component);
    var componentStores = stores(component);
    var newComponentStores = [];
    Object.keys(dependencyMap).forEach(field => {
      var dependency = dependencyMap[field];
      var dependencyStores;
      if (dependency instanceof StoreFacade) {
        dependencyStores = [dependency];
        invariant(
          !componentDependencies.hasOwnProperty(field),
          'StoreDependencyMixin: field "%s" is already defined',
          field
        );
        componentDependencies[field] = {
          deref: defaultDeref,
          stores: dependencyStores
        };
      } else {
        dependencyStores = dependency.stores;
        componentDependencies[field] = dependency;
      }
      // update the store-to-field map
      dependencyStores.forEach(store => {
        var storeId = store.getID();
        if (!componentStoreFields.hasOwnProperty(storeId)) {
          componentStoreFields[storeId] = [];
          // if we haven't seen this store bind a change handler
          componentStores.push(store);
        }
        componentStoreFields[storeId].push(field);
      });
    });
  }
};

module.exports = StoreDependencyMixinInitialize;
