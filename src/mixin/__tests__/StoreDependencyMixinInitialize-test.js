jest.dontMock('../StoreDependencyMixinInitialize.js');

describe('StoreDependencyMixinInitialize', () => {

  var StoreDependencyMixinFields;
  var StoreFacade;

  var mockComponent;
  var mockDependencyMap;
  var mockStore;
  var otherMockStore;

  beforeEach(() => {
    StoreDependencyMixinFields = require('../StoreDependencyMixinFields.js');
    StoreFacade = require('../../store/StoreFacade.js');

    var {applyDependencies} = require('../StoreDependencyMixinInitialize.js');

    mockComponent = {};
    mockStore = new StoreFacade();
    otherMockStore = new StoreFacade();
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
    // TODO: I need to have a working mocked uid to do this
    var {storeFields} = StoreDependencyMixinFields;
    expect(true).toBe(false);
  });

  it('extracts stores from the dependencyMap', () => {
    // TODO: I need to have a working mocked uid to do this
    var {stores} = StoreDependencyMixinFields;
    expect(true).toBe(false);
    return
    expect(stores(mockComponent)).toEqual([
      mockStore,
      otherMockStore
    ]);
  });

});
