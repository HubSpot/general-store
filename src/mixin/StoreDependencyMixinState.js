/**
 * @flow
 */

import {dependencies} from './StoreDependencyMixinFields.js';

export function getDependencyState(
  component: Object,
  props: Object,
  state: Object,
  fieldNames: ?Array<string>
): Object {
  var componentDependencies = dependencies(component);
  fieldNames = fieldNames || Object.keys(componentDependencies);
  var dependencyState = {};
  fieldNames.forEach(field => {
    var {deref, stores} = componentDependencies[field];
    dependencyState[field] = deref(
      props,
      state,
      stores
    );
  });
  return dependencyState;
}
