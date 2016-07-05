/* eslint no-console:0 */
/* @flow */
import type { Dispatcher } from 'flux';
import type StoreFactory from './StoreFactory';

import {isPayload} from '../dispatcher/DispatcherInterface.js';
import Event from '../event/Event.js';
import EventHandler from '../event/EventHandler.js';
import invariant from '../invariant.js';
import uniqueID from '../uniqueid/uniqueID.js';

const HINT_LINK = 'Learn more about using the Store API:' +
  ' https://github.com/HubSpot/general-store#using-the-store-api';

function getNull() {
  return null;
}

export default class Store {

  _dispatcher: Dispatcher;
  _dispatchToken: string;
  _factory: StoreFactory;
  _getter: (...args: Array<any>) => any;
  _event: Event;
  _responses: {[key:string]: (data: any, actionType: string) => any};
  _state: any;
  _uid: number;

  constructor({
    dispatcher,
    factory,
    getter,
    initialState,
    responses,
  }) {
    this._dispatcher = dispatcher;
    this._factory = factory;
    this._getter = getter;
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

  getActionTypes() {
    return Object.keys(this._responses) || [];
  }

  /**
   * Exposes the store's dispatcher instance.
   *
   * @return Dispatcher
   */
  getDispatcher(): Dispatcher {
    return this._dispatcher;
  }

  /**
   * Exposes the token assigned to the store by the dispatcher
   *
   * @return number
   */
  getDispatchToken(): string {
    return this._dispatchToken;
  }

  getFactory(): StoreFactory {
    return this._factory;
  }

  getID(): number {
    return this._uid;
  }

  /**
   * @protected
   * Responds to incoming messages from the Dispatcher
   */
  _handleDispatch(
    payload: ({actionType: string; data: any}) | ({type: string, payload: any})
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
    if (!this._responses.hasOwnProperty(payload.actionType || payload.type)) {
      return;
    }
    this._state = this._responses[payload.actionType || payload.type](
      this._state,
      typeof payload.data !== 'undefined' ? payload.data : payload.payload,
      payload.actionType || payload.type,
      payload
    );
    this.triggerChange();
  }

  /**
   * Destroys this instance of the store.
   * Dispatch callback is unregistered. Subscriptions are removed.
   */
  remove(): void {
    this._dispatcher.unregister(this.getDispatchToken());
    this._event.remove();
    this._getter = getNull;
    this._responses = {};
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
