/* @flow */
import StoreSingleton from './store/StoreSingleton.js';
import StoreFactory from './store/StoreFactory';

export function define(): StoreSingleton {
  return new StoreSingleton();
}

export function defineFactory(): StoreFactory {
  return new StoreFactory({});
}

export { default as DispatcherInstance } from './dispatcher/DispatcherInstance.js';
export { default as StoreDependencyMixin } from './mixin/StoreDependencyMixin.js';
