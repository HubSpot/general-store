/**
 * @flow
 */

var {fields} = require('./StoreDependencyMixinFields.js');

var StoreDependencyMixinState = {
  getDependencyState(
    component: Object,
    fieldNames: ?Array<string>
  ): Object {
    var componentFields = fields(component);
    fieldNames = fieldNames || Object.keys(componentFields);
    var state = {};
    fieldNames.forEach(field => {
      var {deref, stores} = componentFields[field];
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
