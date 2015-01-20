/* @flow */

var StoreConstants = require('./StoreConstants.js');
var StoreFacade = require('./StoreFacade.js');

var {
  enforceDispatcherInterface,
  enforceIsFunction,
  enforceIsString,
  enforceKeyIsNotDefined
} = require('../core/hints/TypeHints.js');

var SCOPE_HINT = 'StoreDefinition';

function emptyGetter() {
  return null;
}

class StoreDefinition {

  _facade: ?StoreFacade;
  _getter: ?Function;
  _responses: {[key: string]: (data: any) => void};

  constructor() {
    this._facade = null;
    this._getter = null;
    this._responses = {};
  }

  defineGet(
    getter: () => any
  ): StoreDefinition {
    enforceIsFunction(getter, SCOPE_HINT);
    this._enforceIsUnregistered();
    this._getter = getter;
    return this;
  }

  defineResponseTo(
    actionType: string,
    response: (data: any) => void
  ): StoreDefinition {
    enforceIsString(actionType, SCOPE_HINT);
    enforceIsFunction(response, SCOPE_HINT);
    enforceKeyIsNotDefined(this._responses, actionType, SCOPE_HINT);
    this._enforceIsUnregistered();
    this._responses[actionType] = response;
    return this;
  }

  _enforceIsReadyForRegistration(): void {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof this._getter !== 'function') {
        throw new Error(
          SCOPE_HINT +
          ': you must call defineGet before calling register.'
        );
      }
    }
  }

  _enforceIsUnregistered(): void {
    if (process.env.NODE_ENV !== 'production') {
      if (this._facade !== null) {
        throw new Error(
          SCOPE_HINT +
          ': a store definition cannot be modified after it is registered'
        );
      }
    }
  }

  register(
    dispatcher: Object
  ): StoreFacade {
    enforceDispatcherInterface(dispatcher, SCOPE_HINT);
    this._enforceIsReadyForRegistration();
    var facade =
      this._facade || new StoreFacade(
        this._getter || emptyGetter,
        this._responses,
        dispatcher
      );
    if (this._facade === null) {
      this._facade = facade;
    }
    return facade;
  }

}

module.exports = StoreDefinition;
