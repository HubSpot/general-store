/**
 * @flow
 */

var StoreFacade = require('../store/StoreFacade.js');

var invariant = require('../invariant.js');
var {
  actions,
  dependencies
} = require('./StoreDependencyMixinFields.js');

function defaultDeref(
  props,
  state,
  storeInstances: Array<StoreFacade>
): any {
  return storeInstances[0].get();
}

var StoreDependencyMixinInitialize = {
  applyDependencies(
    component: Object,
    dependencyMap: Object
  ): void {
    var componentActions = actions(component);
    var componentDependencies = dependencies(component);
    Object.keys(dependencyMap).forEach(field => {
      invariant(
        !componentDependencies.hasOwnProperty(field),
        'StoreDependencyMixin: field "%s" is already defined',
        field
      );
      var dependency = dependencyMap[field];
      var dependencyStores;
      if (dependency instanceof StoreFacade) {
        dependencyStores = [dependency];
        componentDependencies[field] = {
          deref: defaultDeref,
          stores: dependencyStores
        };
      } else {
        dependencyStores = dependency.stores;
        componentDependencies[field] = dependency;
      }
      dependencyStores.forEach(store => {
        store.getActionTypes().forEach(actionType => {
          if (!componentActions.hasOwnProperty(actionType)) {
            componentActions[actionType] = {};
          }
          if (!componentActions[actionType].hasOwnProperty(field)) {
            componentActions[actionType][field] = true;
          }
        });
      });
    });
  }
};

module.exports = StoreDependencyMixinInitialize;
