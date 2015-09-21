/**
 * @flow
 */

import {
  dependencies,
  handlers,
  queue,
  storeFields,
  stores,
} from './StoreDependencyMixinFields.js';

function flushQueue(
  component: Object
): void {
  const componentDependencies = dependencies(component);
  const componentQueue = queue(component);
  const stateUpdate = {};
  Object.keys(componentQueue).forEach(field => {
    const fieldDef = componentDependencies[field];
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
  const componentStores = stores(component);
  componentStores.forEach(store => {
    const dispatcher: Dispatcher = store.getDispatcher();
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
  const componentQueue = queue(component);
  const queueWasEmpty = Object.keys(componentQueue).length === 0;
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

export function cleanupHandlers(component: Object): void {
  const componentHandlers = handlers(component);
  while (componentHandlers.length) {
    componentHandlers.pop().remove();
  }
}

export function setupHandlers(component: Object): void {
  const componentHandlers = handlers(component);
  const componentStores = stores(component);
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
