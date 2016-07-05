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
    expect(Object.keys(GeneralStore.default)).toEqual(exportList);
  });
});
