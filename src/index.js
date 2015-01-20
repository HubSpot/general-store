/* @flow */

var Dispatcher = require('./dispatcher/Dispatcher.js');
var StoreDefinition = require('./store/StoreDefinition.js');

// comment for testing the autocommit

var HSStore = {

  define(): StoreDefinition {
    return new StoreDefinition();
  },

  DispatcherInstance: require('./dispatcher/DispatcherInstance.js'),

  StoreListenerMixin: require('./react/StoreListenerMixin.js')

};

module.exports = HSStore;
