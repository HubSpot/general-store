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
    expect(GeneralStore.hasOwnProperty('define')).toBe(true);
    expect(GeneralStore.hasOwnProperty('defineFactory')).toBe(true);
    expect(GeneralStore.hasOwnProperty('DispatcherInstance')).toBe(true);
    expect(GeneralStore.hasOwnProperty('StoreDependencyMixin')).toBe(true);
  });
});
