import connect from './dependencies/connect';
import connectCallback from './dependencies/connectCallback';
import * as DispatcherInstance from './dispatcher/DispatcherInstance';
import * as InspectStore from './store/InspectStore';
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
  connectCallback,
  define: defineSingleton,
  defineFactory,
  DispatcherInstance,
  InspectStore,
};
