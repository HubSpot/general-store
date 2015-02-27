/**
 * @flow
 */

var EventHandler = require('../event/EventHandler.js');

var FIELDS_KEY = '__StoreDependencyMixin-Fields';
var HANDLERS_KEY = '__StoreDependencyMixin-EventHandlers';
var QUEUE_KEY = '__StoreDependencyMixin-queue';
var STORES_KEY = '__StoreDependencyMixin-stores';

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
  fields(component: Object): Object {
    return getKey(FIELDS_KEY, {}, component);
  },

  handlers(component: Object): Array<EventHandler> {
    return getKey(HANDLERS_KEY, [], component);
  },

  queue(component: Object): {[key:string]: bool} {
    return getKey(QUEUE_KEY, {}, component);
  },

  stores(component: Object): {[key:number]: Array<string>} {
    return getKey(STORES_KEY, {}, component);
  }
}

module.exports = StoreDependencyMixinFields;
