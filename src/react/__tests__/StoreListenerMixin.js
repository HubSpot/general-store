jest.dontMock('../StoreListenerMixin.js');

describe('StoreListenerMixin', () => {

  var StoreFacade;
  var StoreListenerMixin;

  function mixin(mockComponent) {
    for (var prop in StoreListenerMixin) {
      mockComponent[prop] = StoreListenerMixin[prop];
    }
    mockComponent.setState = jest.genMockFn();
    return mockComponent;
  }

  beforeEach(() => {
    StoreFacade = require('../../store/StoreFacade.js');
    StoreListenerMixin = require('../StoreListenerMixin.js');
  });

  it('throws in componentWillMount if getStoreState is not a function', () => {
    var mockStores = [new StoreFacade()];
    expect(() => {
      mixin({
        stores: mockStores
      }).componentWillMount();
    }).toThrow();
    expect(() => {
      mixin({
        getStoreState: 'awighaw',
        stores: mockStores
      }).componentWillMount();
    }).toThrow();
    expect(() => {
      mixin({
        getStoreState: function() {
          return {};
        },
        stores: mockStores
      }).componentWillMount();
    }).not.toThrow();
  });

  it('throws in componentWillMount if stores is not an array of StoreFacades', () => {
    var mockGetStoreState = function() {
      return {};
    };
    expect(() => {
      mixin({
        getStoreState: mockGetStoreState
      }).componentWillMount();
    }).toThrow();
    expect(() => {
      mixin({
        getStoreState: mockGetStoreState,
        stores: []
      }).componentWillMount();
    }).toThrow();
    expect(() => {
      mixin({
        getStoreState: mockGetStoreState,
        stores: [new StoreFacade()]
      }).componentWillMount();
    }).not.toThrow();
  });

  it('binds to the change listener of each store', () => {
    var mockGetStoreState = function() {
      return {};
    };
    var mockStore = new StoreFacade();
    var otherMockStore = new StoreFacade();
    var mockComponent = mixin({
      getStoreState: mockGetStoreState,
      stores: [
        mockStore,
        otherMockStore
      ]
    });
    mockComponent.componentWillMount();
    expect(mockStore.addOnChange.mock.calls.length).toBe(1);
    expect(otherMockStore.addOnChange.mock.calls.length).toBe(1);
  });

  it('cleans up the change listeners on all stores', () => {
    var mockGetStoreState = function() {
      return {};
    };
    var mockStore = new StoreFacade();
    var otherMockStore = new StoreFacade();
    var mockComponent = mixin({
      getStoreState: mockGetStoreState,
      stores: [
        mockStore,
        otherMockStore
      ]
    });
    mockComponent.componentWillMount();
    mockComponent.componentWillUnmount();
    expect(mockStore.removeOnChange.mock.calls.length).toBe(1);
    expect(otherMockStore.removeOnChange.mock.calls.length).toBe(1);
  });

  it('merges getStoreState into set state', () => {
    var mockStoreState = {example: {}};
    var mockGetStoreState = jest.genMockFn().mockReturnValue(mockStoreState);
    var mockComponent = mixin({
      getStoreState: mockGetStoreState,
      stores: [new StoreFacade()]
    });
    mockComponent.handleStoreChange();
    expect(mockGetStoreState.mock.calls.length).toBe(1);
    expect(mockComponent.setState.mock.calls.length).toBe(1);
    expect(mockComponent.setState.mock.calls[0][0]).toBe(mockStoreState);
  });

});

