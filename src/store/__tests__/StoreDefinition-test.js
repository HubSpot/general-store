jest
  .dontMock('../StoreConstants.js')
  .dontMock('../StoreDefinition.js');

describe('StoreDefinition', () => {

  var StoreDefinition;

  beforeEach(() => {
    StoreDefinition = require('../StoreDefinition.js');
  });

});
