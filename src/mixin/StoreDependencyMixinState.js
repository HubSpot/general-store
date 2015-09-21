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
  const componentDependencies = dependencies(component);
  fieldNames = fieldNames || Object.keys(componentDependencies);
  let dependencyState = {};
  fieldNames.forEach(field => {
    let {deref, stores} = componentDependencies[field];
    dependencyState[field] = deref(
      props,
      state,
      stores
    );
  });
  return dependencyState;
}
