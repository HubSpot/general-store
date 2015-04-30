/**
 * @flow
 */

var {
  actions,
  dependencies,
  getDispatcherInfo,
  handlers,
  queue,
  storeFields,
  stores
} = require('./StoreDependencyMixinFields.js');
var { getDependencyState } = require('./StoreDependencyMixinState.js');

function handleDispatch(
  component: Object,
  {actionType}: {actionType: string}
) {
  if (!actions(component).hasOwnProperty(actionType)) {
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
      null
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
    var componentActions = actions(component);
    var componentStores = stores(component);
    var dispatcherInfo = getDispatcherInfo(component);
    componentStores.forEach(store => {
      store.getActionTypes().forEach(actionType => {
        componentActions[actionType] = true;
      });
    });
    if (!dispatcherInfo.dispatcher && componentStores.length) {
      dispatcherInfo.dispatcher = componentStores[0].getDispatcher();
      dispatcherInfo.token =
        componentStores[0].getDispatcher().register(
          handleDispatch.bind(null, component)
        );
    }
  }
};

module.exports = StoreDependencyMixinHandlers;
