/* @flow */

import StoreDefinition from './store/StoreDefinition.js';
import StoreFactory from './store/StoreFactory';
import _DispatcherInstance from './dispatcher/DispatcherInstance.js';
import _StoreDependencyMixin from './mixin/StoreDependencyMixin.js';

function define(): StoreDefinition {
  return new StoreDefinition();
}

function defineFactory(): StoreFactory {
  return new StoreFactory();
}

export default {
  define: define,
  defineFactory: defineFactory,
  DispatcherInstance: _DispatcherInstance,
  StoreDependencyMixin: _StoreDependencyMixin,
};

