/**
 * @flow
 */

import invariant from '../invariant.js';
import {
  dependencies,
  storeFields,
  stores,
} from './StoreDependencyMixinFields.js';
import Store from '../store/Store.js';

function defaultDeref(
  props,
  state,
  storeInstances: Array<Store>
): any {
  return storeInstances[0].get();
}

export function applyDependencies(
  component: Object,
  dependencyMap: Object
): void {
  const componentDependencies = dependencies(component);
  const componentStoreFields = storeFields(component);
  const componentStores = stores(component);
  Object.keys(dependencyMap).forEach(field => {
    const dependency = dependencyMap[field];
    let dependencyStores;
    if (dependency instanceof Store) {
      dependencyStores = [dependency];
      invariant(
        !componentDependencies.hasOwnProperty(field),
        'StoreDependencyMixin: field "%s" is already defined',
        field
      );
      componentDependencies[field] = {
        deref: defaultDeref,
        stores: dependencyStores,
      };
    } else {
      dependencyStores = dependency.stores;
      componentDependencies[field] = dependency;
    }
    // update the store-to-field map
    dependencyStores.forEach(store => {
      const storeId = store.getID();
      if (!componentStoreFields.hasOwnProperty(storeId)) {
        componentStoreFields[storeId] = [];
        // if we haven't seen this store bind a change handler
        componentStores.push(store);
      }
      componentStoreFields[storeId].push(field);
    });
  });
}
