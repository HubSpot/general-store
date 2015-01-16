/* @flow */
var StoreConstants = require('./StoreConstants.js');

var {
  enforceKeyIsDefined,
  enforceIsFunction
} = require('../core/hints/TypeHints.js');

var SCOPE_HINT = 'StoreFacade';

class StoreFacade {

  _dispatcher: Object;
  _dispatchToken: string;
  _getter: (...args: Array<any>) => any;
  _listeners: Array<Function>;
  _responses: {[key:string]: (data: any, actionType: string) => any};

  constructor(
    getter: (...args: Array<any>) => any,
    responses: {[key:string]: (data: any, actionType: string) => any},
    dispatcher: Object
  ) {
    this._dispatcher = dispatcher;
    this._getter = getter;
    this._responses = responses;
    this._listeners = [];

    this._dispatchToken =
      this._dispatcher
        .register(data => this._handleDispatch(data));
  }

  addOnChange(callback: Function): StoreFacade {
    enforceIsFunction(callback, SCOPE_HINT);
    this._listeners.push(callback);
    return this;
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

  removeOnChange(callback: Function): StoreFacade {
    var index = this._listeners.indexOf(callback);
    if (index !== -1) {
      this._listeners.splice(index, 1);
    }
    return this;
  }

  triggerChange(): StoreFacade {
    this._listeners.forEach(listener => listener.call());
    return this;
  }

}

module.exports = StoreFacade;
