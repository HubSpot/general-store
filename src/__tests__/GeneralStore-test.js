import GeneralStore from '../GeneralStore';

jest.disableAutomock();

const exportList = ['connect', 'define', 'defineFactory', 'DispatcherInstance'];

describe('GeneralStore', () => {
  it('should match the export list', () => {
    exportList.forEach(exportName => {
      expect(GeneralStore.hasOwnProperty(exportName)).toBe(true);
    });
  });
});
