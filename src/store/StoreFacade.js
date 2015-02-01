/* @flow */
var Event = require('../event/Event.js');
var EventHandler = require('../event/EventHandler.js');
var StoreConstants = require('./StoreConstants.js');

var {
  enforceKeyIsDefined,
  enforceIsFunction
} = require('../hints/TypeHints.js');

var SCOPE_HINT = 'StoreFacade';

class StoreFacade {

  _dispatcher: Object;
  _dispatchToken: string;
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

    this._dispatchToken =
      this._dispatcher
        .register(data => this._handleDispatch(data));
  }

  addOnChange(callback: Function): EventHandler {
    enforceIsFunction(callback, SCOPE_HINT);
    return this._event.addHandler(callback);
  }

  get(...args: Array<any>): any {
    return this._getter.apply(null, args);
  }

  getDispatcher(): Object {
    return this._dispatcher;
  }

  getDispatchToken(): string {
    return this._dispatchToken;
  }

  _handleDispatch(
    {actionType, data}: {actionType: string; data: any}
  ): void {
    if (!this._responses.hasOwnProperty(actionType)) {
      return;
    }
    this._responses[actionType](data, actionType);
    this.triggerChange();
  }

  triggerChange(): StoreFacade {
    this._event.runHandlers();
    return this;
  }

}

module.exports = StoreFacade;
