/**
 * @flow
 */

var {dependencies} = require('./StoreDependencyMixinFields.js');

var StoreDependencyMixinState = {
  getDependencyState(
    component: Object,
    fieldNames: ?Array<string>
  ): Object {
    var componentDependencies = dependencies(component);
    fieldNames = fieldNames || Object.keys(componentDependencies);
    var state = {};
    fieldNames.forEach(field => {
      var {deref, stores} = componentDependencies[field];
      state[field] = deref(
        component.props,
        component.state,
        stores
      );
    });
    return state;
  }
};

module.exports = StoreDependencyMixinState;
