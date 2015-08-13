/* @flow */

import StoreDefinition from './store/StoreDefinition.js';
import _DispatcherInstance from './dispatcher/DispatcherInstance.js';
import _StoreDependencyMixin from './mixin/StoreDependencyMixin.js';

export function define(): StoreDefinition {
  return new StoreDefinition();
}
export var DispatcherInstance = _DispatcherInstance;
export var StoreDependencyMixin = _StoreDependencyMixin;

