jest
  .dontMock('../StoreListenerMixin.js')
  .mock('../../store/StoreFacade.js');

describe('StoreListenerMixin', () => {

  var StoreListenerMixin;
  var StoreFacade;

  var mockComponent;
  var mockSetState;
  var mockStore;
  var mockValue;

  function mixin(mockComponent) {
    for(var key in StoreListenerMixin) {
      mockComponent[key] = StoreListenerMixin[key];
    }
    return mockComponent;
  }

  beforeEach(() => {
    StoreListenerMixin = require('../StoreListenerMixin.js');
    StoreFacade = require('../../store/StoreFacade.js');

    mockValue = [];
    mockSetState = jest.genMockFn();
    mockStore = new StoreFacade();
    mockStore.get.mockReturnValue(mockValue);
    mockComponent = mixin({
      getStoreDependencies: function() {
        return {
          mock: {
            store: mockStore,
            deref: store => store.get()
          }
        };
      },
      setState: mockSetState
    });
  });

  it('processes dependencies on mockComponentWillMount', () => {
    mockComponent.componentWillMount();
    expect(typeof mockComponent._storeDependencies).toBe('object');
    expect(Array.isArray(mockComponent._storeDependencyHandlers)).toBe(true);
    expect(mockComponent._storeDependencyHandlers.length).toBe(1);
    expect(mockComponent.setState.mock.calls.length).toBe(1);
  });

  it('removes all event handlers on componentWillUnmount', () => {
    var EventHandler = require('../../event/EventHandler.js');
    var mockHandler = new EventHandler();
    mockStore.addOnChange.mockReturnValue(mockHandler);
    mockComponent.componentWillMount();
    mockComponent.componentWillUnmount();
    expect(mockHandler.remove.mock.calls.length).toBe(1);
  });

  it('calls setState when setStoreState is called', () => {
    mockComponent.componentWillMount();
    expect(mockSetState.mock.calls.length).toBe(1);
    mockComponent.setStoreState('mock');
    expect(mockSetState.mock.calls.length).toBe(2);
    expect(mockSetState.mock.calls[1][0].mock).toBe(mockValue);
  });

  it('calls setState when replaceStoreState is called', () => {
    mockComponent.componentWillMount();
    expect(mockSetState.mock.calls.length).toBe(1);
    mockComponent.replaceStoreState();
    expect(mockSetState.mock.calls.length).toBe(2);
    expect(mockSetState.mock.calls[1][0].mock).toBe(mockValue);
  });

  it('binds event handlers to stores on componentWillMount', () => {
    mockComponent.componentWillMount();
    expect(mockStore.addOnChange.mock.calls.length).toBe(1);
    var eventCallback = mockStore.addOnChange.mock.calls[0][0];
    expect(typeof eventCallback).toBe('function');
    eventCallback();
    expect(mockSetState.mock.calls.length).toBe(2);
    expect(mockSetState.mock.calls[1][0].mock).toBe(mockValue);
  });

});
