/* @flow */

import StoreDefinition from './store/StoreDefinition.js';
import _DispatcherInstance from './dispatcher/DispatcherInstance.js';
import _StoreDependencyMixin from './mixin/StoreDependencyMixin.js';

function define(): StoreDefinition {
  return new StoreDefinition();
}
export default {
  define: define,
  DispatcherInstance: _DispatcherInstance,
  StoreDependencyMixin: _StoreDependencyMixin,
};

