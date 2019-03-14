import { Dispatcher } from 'flux';
import { StoreResponses } from './Store';
import StoreFactory from './StoreFactory';
import Store from './Store';

export function getActionTypes(store: Store): Array<string> {
  return Object.keys(store._responses) || [];
}

export function getDispatcher(store: Store): Dispatcher<any> {
  return store._dispatcher;
}

export function getDispatchToken(store: Store): string {
  return store._dispatchToken;
}

export function getGetter(store: Store): (...args: Array<any>) => any {
  return store._getter;
}

export function getId(store: Store): string {
  return store._uid;
}

export function getFactory(store: Store): StoreFactory {
  return store._factory;
}

export function getName(store: Store): string {
  return store._name;
}

export function getResponses(store: Store): StoreResponses {
  return store._responses;
}

export function getState(store: Store) {
  return store._state;
}

export function isStore(store: any): boolean {
  return store instanceof Store;
}
