/**
 * @flow
 */

import {dependencies, stores} from './StoreDependencyMixinFields.js';

function flushQueue(
  component: Object
): void {
  const componentDependencies = dependencies(component);
  const stateUpdate = {};
  Object.keys(componentDependencies).forEach(field => {
    const fieldDef = componentDependencies[field];
    stateUpdate[field] = fieldDef.deref(
      component.props,
      component.state,
      fieldDef.stores
    );
  });
  component.setState(stateUpdate);
}

function handleDispatch(
  component: Object,
): void {
  const componentStores = stores(component);
  const dispatcher = componentStores[0].getDispatcher();
  dispatcher.waitFor(componentStores.map((store) => store.getDispatchToken()));
  flushQueue(component);
}

export function cleanupHandlers(component: Object): void {
  stores(component)[0].getDispatcher().unregister(component.__dispatcherID__);
}

export function setupHandlers(component: Object): void {
  const componentStores = stores(component);
  const types = componentStores.reduce((acc, store) => {
    store.getActionTypes().forEach((type) => {
      acc[type] = true;
    });
    return acc;
  }, {});
  component.__dispatcherID__ = componentStores[0]
    .getDispatcher()
    .register((payload) => {
      if (types[payload.actionType || payload.type]) {
        handleDispatch(component);
      }
    });
}
