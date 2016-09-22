/* @flow */
import type { Dispatcher } from 'flux';
import type Store, { StoreResponses } from './Store';
import type StoreFactory from './StoreFactory';

export function getActionTypes(store: Store): Array<string> {
  return Object.keys(store._responses) || [];
}

export function getDispatcher(store: Store): Dispatcher {
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
