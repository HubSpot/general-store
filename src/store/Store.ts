/* eslint no-console:0 */
import { Dispatcher } from 'flux';
import StoreFactory from './StoreFactory';

import { isPayload } from '../dispatcher/DispatcherInterface';
import Event from '../event/Event';
import EventHandler from '../event/EventHandler';
import invariant from 'invariant';
import uniqueID from '../uniqueid/uniqueID';

const HINT_LINK =
  'Learn more about using the Store API:' +
  ' https://github.com/HubSpot/general-store#using-the-store-api';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: DevToolsExtension;
  }
}

const hasReduxDevTools =
  typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__;

function getNull() {
  return null;
}

export type Action = {
  actionType: string;
  type: string;
  data: any;
  payload: any;
};

export type StoreGetter<T> = (...args: Array<any>) => T;

export type StoreResponse<T> = (
  state: T,
  data: any,
  actionType: string,
  payload: Action
) => any;

export type StoreResponses<T> = {
  [key: string]: StoreResponse<T>;
};

export type StoreOptions<T> = {
  dispatcher: Dispatcher<any>;
  factory: StoreFactory<T>;
  getter: StoreGetter<T>;
  initialState: T;
  name?: string;
  responses: StoreResponses<T>;
};

type DevToolsOptions = {
  name: string;
  instanceId: string;
};

type DevToolsMessage = {
  type: string;
  state: any;
  payload: DevToolsMessage;
};

type DevToolsExtension = {
  connect: (options: DevToolsOptions) => DevToolsExtension;
  send: (message: string, data: any) => any;
  unsubscribe: () => any;
  subscribe: (callback: (message: DevToolsMessage) => void) => any;
};

export default class Store<T> {
  _dispatcher: Dispatcher<any>;
  _dispatchToken: string;
  _factory: StoreFactory<T>;
  _getter: StoreGetter<T>;
  _event: Event;
  _name: string;
  _responses: StoreResponses<T>;
  _state: any;
  _uid: string;
  _devToolsExtension: DevToolsExtension;
  _unsubscribeDevTools?: () => any;

  constructor({
    dispatcher,
    factory,
    getter,
    initialState,
    name,
    responses,
  }: StoreOptions<T>) {
    this._dispatcher = dispatcher;
    this._factory = factory;
    this._getter = getter;
    this._name = name || 'Store';
    this._state = initialState;
    this._responses = responses;
    this._event = new Event();
    this._uid = uniqueID();

    this._dispatchToken = this._dispatcher.register(
      this._handleDispatch.bind(this)
    );

    if (hasReduxDevTools) {
      this._devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__.connect({
        name: name || `Store_${this._uid}`,
        instanceId: this._uid,
      });

      this._unsubscribeDevTools = this._devToolsExtension.subscribe(message => {
        if (
          message.type === 'DISPATCH' &&
          message.payload.type === 'JUMP_TO_ACTION'
        ) {
          this._state = JSON.parse(message.state);
          this.triggerChange();
        }
      });
    }
  }

  /**
   * Subscribe to changes on this store.
   *
   * @param  callback  will run every time the store responds to a dispatcher
   * @return this
   */
  addOnChange(callback: Function): EventHandler {
    invariant(
      typeof callback === 'function',
      'Store.addOnChange: expected callback to be a function' +
        ' but got "%s" instead. %s',
      callback,
      HINT_LINK
    );
    return this._event.addHandler(callback);
  }

  /**
   * Returns the store's referenced value
   *
   * @param  ...  accepts any number of params
   * @return any
   */
  get(...args: any[]): T {
    return this._getter(this._state, ...args);
  }

  /**
   * @protected
   * Responds to incoming messages from the Dispatcher
   */
  _handleDispatch(payload: Action): void {
    if (process.env.NODE_ENV !== 'production') {
      invariant(
        isPayload(payload),
        'Store: expected dispatched payload to be an object with a' +
          ' property "actionType" containing a string and an optional property' +
          ' "data" containing any value but got "%s" instead. Learn more about' +
          ' the dispatcher interface:' +
          ' https://github.com/HubSpot/general-store#dispatcher-interface'
      );
    }
    const actionType = payload.actionType || payload.type;
    const data = payload.hasOwnProperty('data')
      ? payload.data
      : payload.payload;
    if (!actionType || !this._responses.hasOwnProperty(actionType)) {
      return;
    }
    this._state = this._responses[actionType](
      this._state,
      data,
      actionType,
      payload
    );
    this.triggerChange();
    if (this._devToolsExtension) {
      this._devToolsExtension.send(actionType, this._state);
    }
  }

  /**
   * Destroys this instance of the store.
   * Dispatch callback is unregistered. Subscriptions are removed.
   */
  remove(): void {
    this._dispatcher.unregister(this._dispatchToken);
    this._event.remove();
    this._getter = getNull;
    this._responses = {};

    typeof this._unsubscribeDevTools === 'function' &&
      this._unsubscribeDevTools();
    typeof this._devToolsExtension !== 'undefined' &&
      this._devToolsExtension.unsubscribe();
  }

  toString(): string {
    return `${this._name}<${this._state}>`;
  }

  /**
   * Runs all of the store's subscription callbacks
   *
   * @return this
   */
  triggerChange(): Store<T> {
    if (process.env.NODE_ENV !== 'production') {
      if (!this._dispatcher.isDispatching()) {
        console.warn(
          'Store: you called store.triggerChange() outside of a' +
            ' dispatch loop. Send an action trough the dispatcher to' +
            ' avoid potentailly confusing behavior.'
        );
      }
    }
    this._event.runHandlers();
    return this;
  }
}
