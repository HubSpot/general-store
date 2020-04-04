import { Dispatcher } from 'flux';
import { StoreResponses } from './Store';
import StoreFactory from './StoreFactory';
import Store from './Store';

export function getActionTypes(store: Store<any>): Array<string> {
  return Object.keys(store._responses) || [];
}

export function getDispatcher(store: Store<any>): Dispatcher<any> {
  return store._dispatcher;
}

export function getDispatchToken(store: Store<any>): string {
  return store._dispatchToken;
}

export function getGetter<T>(store: Store<T>): (...args: Array<any>) => T {
  return store._getter;
}

export function getId(store: Store<any>): string {
  return store._uid;
}

export function getFactory<T>(store: Store<T>): StoreFactory<T> {
  return store._factory;
}

export function getName(store: Store<any>): string {
  return store._name;
}

export function getResponses(store: Store<any>): StoreResponses<any> {
  return store._responses;
}

export function getState<T>(store: Store<T>): T {
  return store._state;
}

export function isStore(store: any): boolean {
  return store instanceof Store;
}
