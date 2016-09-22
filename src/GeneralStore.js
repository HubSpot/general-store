/* @flow */
import connect from './dependencies/connect';
import * as DispatcherInstance from './dispatcher/DispatcherInstance';
import * as InspectStore from './store/InspectStore';
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
  connect,
  define: defineSingleton,
  defineFactory,
  DispatcherInstance,
  InspectStore,
  StoreDependencyMixin,
};
