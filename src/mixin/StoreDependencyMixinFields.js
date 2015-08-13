/**
 * @flow
 */

var EventHandler = require('../event/EventHandler.js');
var StoreFacade = require('../store/StoreFacade.js');

var DEPENDENCIES_KEY = '__StoreDependencyMixin-dependencies';
var HANDLERS_KEY = '__StoreDependencyMixin-eventHandlers';
var QUEUE_KEY = '__StoreDependencyMixin-queue';
var STORES_KEY = '__StoreDependencyMixin-stores';
var STORE_FIELDS_KEY = '__StoreDependencyMixin-storeFields';

function getKey<T>(
  key: string,
  identity: T,
  component: Object
): T {
  if (!component.hasOwnProperty(key)) {
    component[key] = identity;
  }
  return component[key];
}

var StoreDependencyMixinFields = {
  dependencies(component: Object): Object {
    return getKey(DEPENDENCIES_KEY, {}, component);
  },

  handlers(component: Object): Array<EventHandler> {
    return getKey(HANDLERS_KEY, [], component);
  },

  queue(component: Object): {[key:string]: bool} {
    return getKey(QUEUE_KEY, {}, component);
  },

  stores(component: Object): Array<StoreFacade> {
    return getKey(STORES_KEY, [], component);
  },

  storeFields(component: Object): {[key: string]: Array<string>} {
    return getKey(STORE_FIELDS_KEY, {}, component);
  }
};

module.exports = StoreDependencyMixinFields;
