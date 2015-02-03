/**
 * @flow
 */

jest.dontMock('../GeneralStore.js');

describe('GeneralStore', () => {

  var exportList = [
    'define',
    'DispatcherInstance',
    'StoreDependencyMixin'
  ];
  var GeneralStore = require('../GeneralStore.js');
  var OldGS = null;

  it('should match the export list', () => {
    jest.genMockFn();
    expect(Object.keys(GeneralStore)).toEqual(exportList);
    OldGS = GeneralStore;
  });

  it('should do other stuff', () => {
    console.log(require('../GeneralStore.js') === OldGS);
  });

})
