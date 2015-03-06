jest.dontMock('../StoreDependencyMixinHandlers.js');

describe('StoreDependencyMixinHandlers', () => {

  var EventHandler;
  var StoreDependencyMixinFields;
  var StoreDependencyMixinHandlers;
  var StoreFacade;

  var handlers;
  var stores;

  var mockComponent;
  var mockStore;

  beforeEach(() => {
    EventHandler = require('../../event/EventHandler.js');
    StoreDependencyMixinFields = require('../StoreDependencyMixinFields.js');
    StoreDependencyMixinHandlers =
      require('../StoreDependencyMixinHandlers.js');
    StoreFacade = require('../../store/StoreFacade.js');

    handlers = StoreDependencyMixinFields.handlers;
    stores = StoreDependencyMixinFields.stores;

    mockComponent = {};
    mockStore = new StoreFacade();
    mockStore.addOnChange = jest.genMockFn().mockImpl(() => new EventHandler());

    stores(mockComponent).push(mockStore);
    StoreDependencyMixinHandlers.setupHandlers(mockComponent);
  });

  it('properly sets up handlers', () => {
    expect(mockStore.addOnChange.mock.calls.length).toBe(1);
    expect(handlers(mockComponent).length).toBe(1);
  });

  it('properly cleans up handlers', () => {
    var {cleanupHandlers} = StoreDependencyMixinHandlers;
    cleanupHandlers(mockComponent);
    expect(handlers(mockComponent).length).toBe(0);
  });
});
