jest.dontMock('../StoreDependencyMixin.js');

describe('StoreDependencyMixin', () => {

  var EventHandler;
  var StoreDependencyDefinition;
  var StoreDependencyMixin;
  var StoreFacade;

  var mockComponent;
  var mockDefinition;
  var mockDependencyMap;
  var mockProps;
  var mockState;

  var mixinInstance;

  beforeEach(() => {
    EventHandler = require('../../event/EventHandler.js');
    StoreDependencyDefinition = require('../../store/StoreDependencyDefinition.js');
    StoreDependencyMixin = require('../StoreDependencyMixin.js');
    StoreFacade = require('../../store/StoreFacade.js');

    mockProps = {test: true};
    mockState = {field: 'blah'};

    mockStore = new StoreFacade();
    mockStore.addOnChange.mockImpl(() => new EventHandler());
    mockValue = 'testing';

    mockDependencyMap = {
      mockkey: {
        store: mockStore
      }
    };

    mixinInstance = StoreDependencyMixin(mockDependencyMap);
    mockDefinition = StoreDependencyDefinition.mock.instances[0];
    mockDefinition.getStores.mockReturnValue({mockkey: mockStore});
    mockDefinition.getState.mockReturnValue({mockkey: mockValue});

    mockComponent = {
      props: mockProps,
      setState: jest.genMockFn(),
      state: mockState,
    }
    for (var key in mixinInstance) {
      mockComponent[key] = mixinInstance[key];
    }

    mockComponent.componentWillMount();
  });

  it('instantiates a StoreDependencyDefinition', () => {
    expect(mockDefinition).not.toBeFalsy();
  });

  it('subscribes to stores in the map on componentWillMount', () => {
    expect(mockComponent._storeDependencyHandlers.length).toBe(1);
  });

  it('unsubscribes from stores in the map on componentWillUnmount', () => {
    var mockHandler = mockComponent._storeDependencyHandlers[0];
    mockComponent.componentWillUnmount();
    expect(mockComponent._storeDependencyHandlers.length).toBe(0);
    expect(mockHandler.remove.mock.calls.length).toBe(1);
  });

  it('sets state in componentWillUpdate', () => {
    var mockNextProps = {};
    var mockNextState = {};
    mockComponent.componentWillUpdate(mockNextProps, mockNextState);
    expect(mockComponent.setState.mock.calls.length).toBe(1);
    expect(mockComponent.setState.mock.calls[0][0]).toEqual({
      mockkey: mockValue
    });
    expect(mockDefinition.getState.mock.calls.length).toBe(1);
    expect(mockDefinition.getState.mock.calls[0][0]).toBe(mockNextProps);
    expect(mockDefinition.getState.mock.calls[0][1]).toBe(mockNextState);
  });

  it('gets state in getInitialState', () => {
    expect(mockComponent.getInitialState()).toEqual({
      mockkey: mockValue
    });
    expect(mockDefinition.getState.mock.calls.length).toBe(1);
    expect(mockDefinition.getState.mock.calls[0][0]).toBe(mockProps);
    expect(mockDefinition.getState.mock.calls[0][1]).toBe(mockState);
  });

});
