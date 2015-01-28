/* @flow */

var StoreDefinition = require('./store/StoreDefinition.js');

var GeneralStore = {

  define(): StoreDefinition {
    return new StoreDefinition();
  },

  DispatcherInstance: require('./dispatcher/DispatcherInstance.js'),

  StoreListenerMixin: require('./react/StoreListenerMixin.js')

};

module.exports = GeneralStore;
