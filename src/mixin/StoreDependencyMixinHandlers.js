/**
 * @flow
 */

var {
  dependencies,
  handlers,
  queue,
  storeFields,
  stores
} = require('./StoreDependencyMixinFields.js');

function flushQueue(
  component: Object
): void {
  var componentDependencies = dependencies(component);
  var componentQueue = queue(component);
  var stateUpdate = {};
  Object.keys(componentQueue).forEach(field => {
    var fieldDef = componentDependencies[field];
    stateUpdate[field] = fieldDef.deref(
      component.props,
      component.state,
      fieldDef.stores
    );
    delete componentQueue[field];
  });
  component.setState(stateUpdate);
}

function waitForOtherStores(
  component: Object,
  currentStoreId: string
): void {
  var componentStores = stores(component);
  componentStores.forEach(store => {
    var dispatcher: Dispatcher = store.getDispatcher();
    if (store.getID() === currentStoreId || !dispatcher.isDispatching()) {
      return;
    }
    dispatcher.waitFor([store.getDispatchToken()]);
  });
}

function handleStoreChange(
  component: Object,
  storeId: string
): void {
  var componentQueue = queue(component);
  var queueWasEmpty = Object.keys(componentQueue).length === 0;
  storeFields(component)[storeId].forEach(field => {
    if (componentQueue.hasOwnProperty(field)) {
      return;
    }
    componentQueue[field] = true;
  });
  // if there we already fields in the queue, this isn't the first store to
  // respond to the action so bail out
  if (!queueWasEmpty) {
    return;
  }
  // waitFor all other stores this component depends on to ensure we dont
  // run an extra setState if another store responds to the same action
  waitForOtherStores(component, storeId);
  flushQueue(component);
}

var StoreDependencyMixinHandlers = {
  cleanupHandlers(component: Object): void {
    var componentHandlers = handlers(component);
    while (componentHandlers.length) {
      componentHandlers.pop().remove();
    }
  },

  setupHandlers(component: Object): void {
    var componentHandlers = handlers(component);
    var componentStores = stores(component);
    componentStores.forEach(store => {
      componentHandlers.push(
        store.addOnChange(
          handleStoreChange.bind(
            null,
            component,
            store.getID()
          )
        )
      );
    });
  }
};

module.exports = StoreDependencyMixinHandlers;
