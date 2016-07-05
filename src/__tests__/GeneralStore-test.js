jest.unmock('../GeneralStore.js');

const exportList = [
  'define',
  'defineFactory',
  'DispatcherInstance',
  'StoreDependencyMixin',
];

describe('GeneralStore', () => {
  let GeneralStore;

  beforeEach(() => {
    GeneralStore = require('../GeneralStore.js');
  });

  it('should match the export list', () => {
    exportList.forEach((exportName) => {
      expect(GeneralStore.hasOwnProperty(exportName)).toBe(true);
    });
  });
});
