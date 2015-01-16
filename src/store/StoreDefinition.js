/* @flow */

var StoreConstants = require('./StoreConstants.js');
var StoreFacade = require('./StoreFacade.js');

var {
  enforceIsFunction,
  enforceIsString,
  enforceKeyIsNotDefined
} = require('../hints/PrimitiveTypeHints.js');

var SCOPE_HINT = 'StoreDefinition';

class StoreDefinition {

  _facade: ?StoreFacade;
  _getters: {[key: string]: () => any};
  _responses: {[key: string]: (data: any) => void};

  constructor() {
    this._facade = null;
    this._getters = {}
    this._responses = {};
  }

  defineGet(
    getter: Function
  ): StoreDefinition {
    enforceKeyIsNotDefined(
      this._getters,
      StoreConstants.DEFAULT_GETTER_KEY,
      SCOPE_HINT
    );
    return this.defineGetKey(
      StoreConstants.DEFAULT_GETTER_KEY,
      getter
    );
  }

  defineGetKey(
    key: string,
    getter: () => any
  ): StoreDefinition {
    enforceIsString(key, SCOPE_HINT);
    enforceIsFunction(getter, SCOPE_HINT);
    enforceKeyIsNotDefined(this._getters, key, SCOPE_HINT);
    this._enforceUnregistered();
    this._getters[key] = getter;
    return this;
  }

  defineResponseTo(
    actionType: string,
    response: (data: any) => void
  ): StoreDefinition {
    
    enforceIsString(actionType, SCOPE_HINT);
    enforceIsFunction(response, SCOPE_HINT);
    this._responses[actionType] = response;
    return this;
  }

  _enforceUnregistered(): void {
    if (this._facade !== null) {
      throw new Error(
        SCOPE_HINT +
        ': a store definition cannot be modified after it is registered'
      );
    }
  }

  register(
    dispatcher: Object
  ): StoreFacade {
    var facade =
      this._facade || new StoreFacade(
        this._getters,
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
