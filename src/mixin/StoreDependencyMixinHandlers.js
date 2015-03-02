/**
 * @flow
 */

var {fields, handlers, queue, storeFields, stores} = require('./StoreDependencyMixinFields.js');

function handleStoreChange(
  component: Object,
  storeId: number
): void {
  var componentQueue = queue(component);
  var queueWasEmpty = Object.keys(componentQueue).length === 0;
  storeFields(component)[storeId].forEach(field => {
    if (componentQueue.hasOwnProperty(field)) {
      return;
    }
    componentQueue[field] = true
    waitForFieldStores(component, field, storeId)
  });
  if (!queueWasEmpty) {
    return;
  }
  var componentFields = fields(component);
  var stateUpdate = {};
  Object.keys(componentQueue).forEach(field => {
    var {deref, stores} = componentFields[field];
    stateUpdate[field] = deref(
      component.props,
      component.state,
      stores
    );
    delete componentQueue[field];
  });
  component.setState(stateUpdate);
}

function waitForFieldStores(
  component: Object,
  field: string,
  currentStoreId: number
): void {
  var dependency = fields(component)[field];
  dependency.stores.forEach(store => {
    if (store.getID() === currentStoreId) {
      return;
    }
    store.getDispatcher().waitFor([store.getDispatchToken()]);
  });
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
