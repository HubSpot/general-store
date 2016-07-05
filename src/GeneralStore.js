/* @flow */
import * as _DispatcherInstance from './dispatcher/DispatcherInstance';
import _StoreDependencyMixin from './mixin/StoreDependencyMixin';
import StoreSingleton from './store/StoreSingleton';
import StoreFactory from './store/StoreFactory';

export function define(): StoreSingleton {
  return new StoreSingleton();
}

export function defineFactory(): StoreFactory {
  return new StoreFactory({});
}

export const DispatcherInstance = _DispatcherInstance;

export const StoreDependencyMixin = _StoreDependencyMixin;
