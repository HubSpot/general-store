/* @flow */
import * as DispatcherInstance from './dispatcher/DispatcherInstance';
import StoreDependencyMixin from './dependencies/StoreDependencyMixin';
import StoreSingleton from './store/StoreSingleton';
import StoreFactory from './store/StoreFactory';

function defineSingleton(): StoreSingleton {
  return new StoreSingleton();
}

function defineFactory(): StoreFactory {
  return new StoreFactory({});
}

module.exports = {
  define: defineSingleton,
  defineFactory,
  DispatcherInstance,
  StoreDependencyMixin,
};
