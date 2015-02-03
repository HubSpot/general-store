/* @flow */
var Event = require('../event/Event.js');
var EventHandler = require('../event/EventHandler.js');
var StoreConstants = require('./StoreConstants.js');

var {
  enforceKeyIsDefined,
  enforceIsFunction
} = require('../hints/TypeHints.js');

var SCOPE_HINT = 'StoreFacade';

function getNull() {
  return null;
}

class StoreFacade {

  _dispatcher: Object;
  _dispatchToken: number;
  _getter: (...args: Array<any>) => any;
  _event: Event;
  _responses: {[key:string]: (data: any, actionType: string) => any};

  constructor(
    getter: (...args: Array<any>) => any,
    responses: {[key:string]: (data: any, actionType: string) => any},
    dispatcher: Object
  ) {
    this._dispatcher = dispatcher;
    this._getter = getter;
    this._responses = responses;
    this._event = new Event();

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
    enforceIsFunction(callback, SCOPE_HINT);
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
  getDispatcher(): Object {
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

  /**
   * @protected
   * Responds to incoming messages from the Dispatcher
   */
  _handleDispatch(
    {actionType, data}: {actionType: string; data: any}
  ): void {
    if (!this._responses.hasOwnProperty(actionType)) {
      return;
    }
    this._responses[actionType](data, actionType);
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
    this._event.runHandlers();
    return this;
  }

}

module.exports = StoreFacade;
