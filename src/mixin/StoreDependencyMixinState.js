/**
 * @flow
 */

var {dependencies} = require('./StoreDependencyMixinFields.js');

var StoreDependencyMixinState = {
  getDependencyState(
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
};

module.exports = StoreDependencyMixinState;
