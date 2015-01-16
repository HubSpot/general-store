/* @flow */

var StoreDefinition = require('./store/StoreDefinition.js');

var HSStore = {

  define(): StoreDefinition {
    return new StoreDefinition();
  }

};

module.exports = HSStore;
