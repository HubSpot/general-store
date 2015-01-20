jest.dontMock('../HSStore.js');

describe('HSStore', () => {

  var exportList = [
    'define',
    'DispatcherInstance',
    'StoreListenerMixin'
  ];
  var HSStore;

  beforeEach(() => {
    HSStore = require('../HSStore.js');
  });

  it('should match the export list', () => {
    expect(Object.keys(HSStore)).toEqual(exportList);
  });

})
