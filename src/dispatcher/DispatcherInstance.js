/**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * @flow weak
 **/

interface Dispatcher {
  register(handleAction: (data: any, actionType: string) => void): number;
  unregister(dispatchToken: number): void;
}

var DispatcherInterface = require('./DispatcherInterface.js');

var invariant = require('../invariant.js');

var instance = null;

var DispatcherInstance = {

  get(): Dispatcher {
    invariant(
      instance !== null,
      'DispatcherInstance.get: you haven\'t provide a dispatcher instance.' +
      ' You can pass an instance to' +
      ' GeneralStore.define().register(dispatcher) or use' +
      ' GeneralStore.DispatcherInstance.set(dispatcher) to set a global' +
      ' instance.' +
      ' https://github.com/HubSpot/general-store#default-dispatcher-instance'
    );
    return instance;
  },

  set(dispatcher: Dispatcher): void {
    invariant(
      DispatcherInterface.isDispatcher(dispatcher),
      'DispatcherInstance.set: Expected dispatcher to be an object' +
      ' with a register method, and an unregister method but got "%s".' +
      ' Learn more about the dispatcher interface:' +
      ' https://github.com/HubSpot/general-store#dispatcher-interface',
      dispatcher
    );
    instance = dispatcher;
  }

};

module.exports = DispatcherInstance;
