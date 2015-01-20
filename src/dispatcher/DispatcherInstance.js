/* @flow */

var Dispatcher = require('./Dispatcher.js');

var {enforceDispatcherInterface} = require('../core/hints/TypeHints.js');

var instance = null;

var DispatcherInstance = {

  get(): Dispatcher {
    return instance || window.Flux.Dispatcher;
  },

  set(dispatcher: Dispatcher): void {
    enforceDispatcherInterface(dispatcher, 'DispatcherInstance');
    instance = dispatcher;
  }

};

module.exports = DispatcherInstance;
