jest.dontMock('../GeneralStore.js');

describe('GeneralStore', () => {

  var exportList = [
    'define',
    'DispatcherInstance',
    'StoreDependencyMixin',
  ];
  var GeneralStore;

  beforeEach(() => {
    GeneralStore = require('../GeneralStore.js');
  });

  it('should match the export list', () => {
    expect(Object.keys(GeneralStore)).toEqual(exportList);
  });

});
