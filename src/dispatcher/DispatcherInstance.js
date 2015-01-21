/**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * @flow weak
 **/

interface Dispatcher {
  register(handleAction: (data: any, actionType: string) => void): number;
  unregister(dispatchToken: number): void;
}

var {enforceDispatcherInterface} = require('../core/hints/TypeHints.js');

var instance = null;

var DispatcherInstance = {

  get(): Dispatcher {
    if (!instance) {
      throw new Error('set a dispatcher please');
    }
    return instance;
  },

  set(dispatcher: Dispatcher): void {
    enforceDispatcherInterface(dispatcher, 'DispatcherInstance');
    instance = dispatcher;
  }

};

module.exports = DispatcherInstance;
