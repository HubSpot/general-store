jest
  .dontMock('../StoreConstants.js')
  .dontMock('../StoreFacade.js');

describe('StoreFacade', () => {

  var StoreFacade;

  beforeEach(() => {
    StoreFacade = require('../StoreFacade.js');
  });

});

