/* @flow */

interface Dispatcher {
  register(handleAction: (data: any, actionType: string) => void): number;
  unregister(dispatchToken: number): void;
}

var DispatcherInstance = require('../dispatcher/DispatcherInstance.js');
var DispatcherInterface = require('../dispatcher/DispatcherInterface.js');
var StoreConstants = require('./StoreConstants.js');
var StoreFacade = require('./StoreFacade.js');

var invariant = require('../invariant.js');

function emptyGetter() {
  return null;
}

var HINT_LINK =
  'Learn more about defining stores:' +
  ' https://github.com/HubSpot/general-store#create-a-store';

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
    invariant(
      !this.isRegistered(),
      'StoreDefinition.defineGet: this store definition cannot be modified' +
      ' because is has already been registered with a dispatcher. %s',
      HINT_LINK
    );
    invariant(
      typeof getter === 'function',
      'StoreDefinition.defineGet: expected getter to be a function but got' +
      ' "%s" instead. %s',
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
    invariant(
      !this.isRegistered(),
      'StoreDefinition.defineResponseTo: this store definition cannot be' +
      ' modified because is has already been registered with a dispatcher. %s',
      HINT_LINK
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
      'StoreDefinition.defineResponseTo: conflicting resposes for actionType' +
      ' "%s". Only one response can be defined per actionType per Store. %s',
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

  isRegistered(): bool {
    return this._facade instanceof StoreFacade;
  }

  register(dispatcher: ?Dispatcher): StoreFacade {
    invariant(
      !dispatcher || DispatcherInterface.isDispatcher(dispatcher),
      'StoreDefinition.register: Expected dispatcher to be an object' +
      ' with a register method, and an unregister method but got "%s".' +
      ' Learn more about the dispatcher interface:' +
      ' https://github.com/HubSpot/general-store#dispatcher-interface',
      dispatcher
    );
    invariant(
      typeof this._getter === 'function',
      'StoreDefinition.register: a store cannot be registered without a' +
      ' getter. Use GeneralStore.define().defineGet(getter) to define a' +
      ' getter. %s',
      HINT_LINK
    );
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
