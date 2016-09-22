/* eslint no-console:0 */
/* @flow */
import type { Action, Dispatcher } from 'flux';
import type StoreFactory from './StoreFactory';

import { isPayload } from '../dispatcher/DispatcherInterface.js';
import Event from '../event/Event.js';
import EventHandler from '../event/EventHandler.js';
import invariant from 'invariant';
import uniqueID from '../uniqueid/uniqueID.js';

const HINT_LINK = 'Learn more about using the Store API:' +
  ' https://github.com/HubSpot/general-store#using-the-store-api';

function getNull() {
  return null;
}

export type StoreGetter = (...args: Array<any>) => any;

export type StoreResponses = {
  [key:string]: (
    state: any,
    data: any,
    actionType: string,
    payload: Action,
  ) => any
};

type StoreOptions = {
  dispatcher: Dispatcher;
  factory: StoreFactory;
  getter: (...args: Array<any>) => any;
  initialState: any;
  name: ?string;
  responses: {};
};

export default class Store {

  _dispatcher: Dispatcher;
  _dispatchToken: string;
  _factory: StoreFactory;
  _getter: StoreGetter;
  _event: Event;
  _name: string;
  _responses: StoreResponses;
  _state: any;
  _uid: string;

  constructor({
    dispatcher,
    factory,
    getter,
    initialState,
    name,
    responses,
  }: StoreOptions) {
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
  get(...args: Array<any>): any {
    return this._getter(this._state, ...args);
  }

  /**
   * @protected
   * Responds to incoming messages from the Dispatcher
   */
  _handleDispatch(
    payload: Action
  ): void {
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
    const data = payload.hasOwnProperty('data') ? payload.data : payload.payload;
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
  }

  toString(): string {
    return `${this._name}<${this._state}>`;
  }

  /**
   * Runs all of the store's subscription callbacks
   *
   * @return this
   */
  triggerChange(): Store {
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
