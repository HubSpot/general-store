jest.dontMock('../StoreDependencyMixinHandlers.js');

describe('StoreDependencyMixinHandlers', () => {
  var Dispatcher;
  var EventHandler;
  var StoreDependencyMixinFields;
  var StoreDependencyMixinHandlers;
  var StoreFacade;

  var actions;
  var getDispatcherInfo;
  var handlers;
  var stores;

  var mockActions;
  var mockComponent;
  var mockDispatcher;
  var mockDispatchToken;
  var mockStore;

  beforeEach(() => {
    Dispatcher = require('flux').Dispatcher;
    EventHandler = require('../../event/EventHandler.js');
    StoreDependencyMixinFields = require('../StoreDependencyMixinFields.js');
    StoreDependencyMixinHandlers =
      require('../StoreDependencyMixinHandlers.js');
    StoreFacade = require('../../store/StoreFacade.js');

    handlers = StoreDependencyMixinFields.handlers;
    getDispatcherInfo = StoreDependencyMixinFields.getDispatcherInfo;
    actions = StoreDependencyMixinFields.actions;
    stores = StoreDependencyMixinFields.stores;

    mockActions = ['FAKE_ACTION'];
    mockComponent = {};
    mockDispatcher = new Dispatcher();
    mockDispatchToken = 1234;
    mockStore = new StoreFacade();
    mockStore.getDispatcher = jest.genMockFn().mockReturnValue(mockDispatcher);
    mockStore.getActionTypes = jest.genMockFn().mockReturnValue(mockActions);
    mockDispatcher.register =
      jest.genMockFn().mockReturnValue(mockDispatchToken);

    stores(mockComponent).push(mockStore);
    StoreDependencyMixinHandlers.setupHandlers(mockComponent);
  });

  it('properly sets up handlers', () => {
    expect(Object.keys(actions(mockComponent))).toEqual(mockActions);
    expect(getDispatcherInfo(mockComponent).dispatcher).toBe(mockDispatcher);
    expect(getDispatcherInfo(mockComponent).token).toBe(mockDispatchToken);
  });

  it('properly cleans up handlers', () => {
    var {cleanupHandlers} = StoreDependencyMixinHandlers;
    cleanupHandlers(mockComponent);
    expect(mockDispatcher.unregister.mock.calls.length).toBe(1);
    expect(mockDispatcher.unregister.mock.calls[0][0]).toBe(mockDispatchToken);
  });
});
