/* @flow */

var DispatcherInterface = require('../dispatcher/DispatcherInterface.js');
var Event = require('../event/Event.js');
var EventHandler = require('../event/EventHandler.js');

var uniqueID = require('../uniqueid/uniqueID.js');
var invariant = require('../invariant.js');

var HINT_LINK = 'Learn more about using the Store API:' +
  ' https://github.com/HubSpot/general-store#using-the-store-api';

function getNull() {
  return null;
}

class StoreFacade {

  _dispatcher: Dispatcher;
  _dispatchToken: number;
  _getter: (...args: Array<any>) => any;
  _event: Event;
  _responses: {[key:string]: (data: any, actionType: string) => any};
  _uid: number;

  constructor(
    getter: (...args: Array<any>) => any,
    responses: {[key:string]: (data: any, actionType: string) => any},
    dispatcher: Object
  ) {
    this._dispatcher = dispatcher;
    this._getter = getter;
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
      'StoreFacade.addOnChange: expected callback to be a function' +
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
    return this._getter.apply(null, args);
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
  getDispatchToken(): number {
    return this._dispatchToken;
  }

  getID(): number {
    return this._uid;
  }

  /**
   * @protected
   * Responds to incoming messages from the Dispatcher
   */
  _handleDispatch(
    payload: {actionType: string; data: any}
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      invariant(
        DispatcherInterface.isPayload(payload),
        'StoreFacade: expected dispatched payload to be an object with a property' +
        ' "actionType" containing a string and an optional property "data" containing' +
        ' any value but got "%s" instead. Learn more about the dispatcher interface:' +
        ' https://github.com/HubSpot/general-store#dispatcher-interface'
      );
    }
    if (!this._responses.hasOwnProperty(payload.actionType)) {
      return;
    }
    this._responses[payload.actionType](
      payload.data,
      payload.actionType,
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
  triggerChange(): StoreFacade {
    if (process.env.NODE_ENV !== 'production') {
      if (!this._dispatcher.isDispatching()) {
        console.warn(
          'StoreFacade: you called store.triggerChange() outside of a' +
            ' dispatch loop. Send an action trough the dispatcher to' +
            ' avoid potentailly confusing behavior.'
        );
      }
    }
    this._event.runHandlers();
    return this;
  }

}

module.exports = StoreFacade;
