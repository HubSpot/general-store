jest.dontMock('../StoreDependencyMixinHandlers.js');

describe('StoreDependencyMixinHandlers', () => {

  let EventHandler;
  let StoreDependencyMixinFields;
  let StoreDependencyMixinHandlers;
  let Store;

  let handlers;
  let stores;

  let mockComponent;
  let mockStore;

  beforeEach(() => {
    EventHandler = require('../../event/EventHandler.js');
    StoreDependencyMixinFields = require('../StoreDependencyMixinFields.js');
    StoreDependencyMixinHandlers =
      require('../StoreDependencyMixinHandlers.js');
    Store = require('../../store/Store.js');

    handlers = StoreDependencyMixinFields.handlers;
    stores = StoreDependencyMixinFields.stores;

    mockComponent = {};
    mockStore = new Store();
    mockStore.addOnChange = jest.genMockFn().mockImpl(() => new EventHandler());

    stores(mockComponent).push(mockStore);
    StoreDependencyMixinHandlers.setupHandlers(mockComponent);
  });

  it('properly sets up handlers', () => {
    expect(mockStore.addOnChange.mock.calls.length).toBe(1);
    expect(handlers(mockComponent).length).toBe(1);
  });

  it('properly cleans up handlers', () => {
    let {cleanupHandlers} = StoreDependencyMixinHandlers;
    cleanupHandlers(mockComponent);
    expect(handlers(mockComponent).length).toBe(0);
  });
});
