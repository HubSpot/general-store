/* @flow */

interface Dispatcher {
  register(handleAction: (data: any, actionType: string) => void): number;
  unregister(dispatchToken: number): void;
}

var DispatcherInstance = require('../dispatcher/DispatcherInstance.js');
var StoreConstants = require('./StoreConstants.js');
var StoreFacade = require('./StoreFacade.js');

var { enforceDispatcherInterface } = require('../hints/Hints.js');
var invariant = require('../invariant.js');

function emptyGetter() {
  return null;
}

var HINT_LINK =
  'Learn more about defining stores:' +
  ' https://github.com/HubSpot/general-store#create-a-store';

function enforceIsUnregistered(
  scope: string,
  facade: any
): void {
  invariant(
    !(facade instanceof StoreFacade),
    '%s: this store definition cannot be modified because is has already been' +
    ' registered with a dispatcher. %s',
    scope,
    HINT_LINK
  );
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
    enforceIsUnregistered(
      'StoreDefinition.defineGet',
      this._facade
    );
    invariant(
      typeof getter === 'function',
      'StoreDefinition.defineGet: expected getter to be a function but got "%s" instead. %s' +
      getter,
      HINT_LINK
    );
    this._getter = getter;
    return this;
  }

  defineResponseTo(
    actionType: string,
    response: (data: any) => void
  ): StoreDefinition {
    enforceIsUnregistered(
      'StoreDefinition.defineResponseTo',
      this._facade
    );
    invariant(
      typeof actionType === 'string',
      'StoreDefinition.defineResponseTo: expected actionType to be a string' +
      ' but got "%s" instead. %s',
      actionType,
      HINT_LINK
    );
    invariant(
      !this._responses.hasOwnProperty(actionType),
      'StoreDefinition.defineResponseTo: conflicting resposes for actionType "%s".' +
      ' Only one response can be defined per actionType per Store. %s',
      actionType,
      HINT_LINK
    );
    invariant(
      typeof response === 'function',
      'StoreDefinition.defineResponseTo: expected response to be a function' +
      ' but got "%s" instead. %s',
      response
    );
    this._responses[actionType] = response;
    return this;
  }

  register(dispatcher: ?Dispatcher): StoreFacade {
    invariant(
      typeof this._getter === 'function',
      'StoreDefinition.register: a store cannot be registered without a getter.' +
      ' Use GeneralStore.define().defineGet(getter) to define a getter. %s',
      HINT_LINK
    );
    if (dispatcher) {
      enforceDispatcherInterface(
        'StoreDefinition.register',
        dispatcher
      );
    }
    var facade =
      this._facade || new StoreFacade(
        this._getter || emptyGetter,
        this._responses,
        dispatcher || DispatcherInstance.get()
      );
    if (this._facade === null) {
      this._facade = facade;
    }
    return facade;
  }

}

module.exports = StoreDefinition;
