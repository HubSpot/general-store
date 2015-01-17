/* @flow */

var StoreDefinition = require('./store/StoreDefinition.js');

var HSStore = {

  define(): StoreDefinition {
    return new StoreDefinition();
  },

  StoreListenerMixin: require('./react/StoreListenerMixin.js')

};

module.exports = HSStore;
