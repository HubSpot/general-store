jest.dontMock('../StoreDependencyMixinInitialize.js');

describe('StoreDependencyMixinInitialize', () => {

  var StoreDependencyMixinFields;
  var StoreFacade;

  var applyDependencies;
  var mockComponent;
  var mockDependencyMap;
  var mockStore;
  var otherMockStore;

  beforeEach(() => {
    applyDependencies =
      require('../StoreDependencyMixinInitialize.js').applyDependencies;
    StoreDependencyMixinFields = require('../StoreDependencyMixinFields.js');
    StoreFacade = require('../../store/StoreFacade.js');

    mockComponent = {};
    mockStore = new StoreFacade();
    mockStore.getID = jest.genMockFn().mockReturnValue(123);
    otherMockStore = new StoreFacade();
    otherMockStore.getID = jest.genMockFn().mockReturnValue(321);
    mockDependencyMap = {
      test: mockStore,
      otherTest: {
        stores: [mockStore, otherMockStore],
        deref: () => 'otherTest'
      }
    };
    applyDependencies(mockComponent, mockDependencyMap);
  });

  it('extracts dependencies', () => {
    var {dependencies} = StoreDependencyMixinFields;
    var componentDeps = dependencies(mockComponent);
    expect(componentDeps.test.stores).toEqual([mockStore]);
    expect(typeof componentDeps.test.deref).toEqual('function');
    expect(componentDeps.otherTest).toBe(mockDependencyMap.otherTest);
  });

  it('extracts store->field dependencies', () => {
    var {storeFields} = StoreDependencyMixinFields;
    var componentStoreFields = storeFields(mockComponent);
    expect(componentStoreFields).toEqual({
      123: ['test', 'otherTest'],
      321: ['otherTest']
    });
  });

  it('extracts stores from the dependencyMap', () => {
    var {stores} = StoreDependencyMixinFields;
    expect(stores(mockComponent)).toEqual([
      mockStore,
      otherMockStore
    ]);
  });

  it('throws for duplicate fields', () => {
    var otherMockComponent = {};
    var otherMockDependencyMap = {
      test: mockStore,
      otherTest: otherMockStore
    };
    expect(
      () => applyDependencies(otherMockComponent, otherMockDependencyMap)
    ).toThrow();
  });

});
