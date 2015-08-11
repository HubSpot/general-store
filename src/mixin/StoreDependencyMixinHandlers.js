/**
 * @flow
 */

var {
  actions,
  dependencies,
  getDispatcherInfo,
  stores
} = require('./StoreDependencyMixinFields.js');
var { getDependencyState } = require('./StoreDependencyMixinState.js');

function handleDispatch(
  component: Object,
  {actionType}: {actionType: string}
) {
  var componentActions = actions(component);
  if (!componentActions.hasOwnProperty(actionType)) {
    return;
  }
  var dispatcher = getDispatcherInfo(component).dispatcher;
  if (!dispatcher) {
    return;
  }
  dispatcher.waitFor(
    stores(component).map(store => store.getDispatchToken())
  );
  component.setState(
    getDependencyState(
      component,
      component.props,
      component.state,
      Object.keys(componentActions[actionType])
    )
  );
}

var StoreDependencyMixinHandlers = {
  cleanupHandlers(component: Object): void {
    var {dispatcher, token} = getDispatcherInfo(component);
    if (!dispatcher) {
      return;
    }
    dispatcher.unregister(token);
  },

  setupHandlers(component: Object): void {
    var componentDependencies = dependencies(component);
    var dispatcherInfo = getDispatcherInfo(component);
    var firstField = Object.keys(componentDependencies)[0];
    if (!dispatcherInfo.dispatcher && firstField) {
      var dispatcher =
        componentDependencies[firstField].stores[0].getDispatcher();
      dispatcherInfo.dispatcher = dispatcher;
      dispatcherInfo.token =
        dispatcher.register(
          handleDispatch.bind(null, component)
        );
    }
  }
};

module.exports = StoreDependencyMixinHandlers;
