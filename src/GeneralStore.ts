import * as DispatcherInstance from './dispatcher/DispatcherInstance';
import * as InspectStore from './store/InspectStore';
import StoreSingleton from './store/StoreSingleton';
import StoreFactory from './store/StoreFactory';

export function define<T>(): StoreSingleton<T> {
  return new StoreSingleton();
}

export function defineFactory<T>(): StoreFactory<T> {
  return new StoreFactory({});
}

export { default as connect } from './dependencies/connect';
export { default as connectCallback } from './dependencies/connectCallback';
export {
  default as useStoreDependency,
} from './dependencies/useStoreDependency';
export { DispatcherInstance, InspectStore };
