jest.dontMock('../index.js');

describe('index', () => {

  var exportList = [
    'define',
    'StoreListenerMixin'
  ];
  var HSStore;

  beforeEach(() => {
    HSStore = require('../index.js');
  });

  it('should match the export list', () => {
    expect(Object.keys(HSStore)).toEqual(exportList);
  });

})
