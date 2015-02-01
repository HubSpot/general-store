/* @flow */

var StoreDefinition = require('./store/StoreDefinition.js');

var GeneralStore = {

  define(): StoreDefinition {
    return new StoreDefinition();
  },

  DispatcherInstance: require('./dispatcher/DispatcherInstance.js'),

};

module.exports = GeneralStore;
