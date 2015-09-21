jest.dontMock('../Store.js');

describe('Store', () => {

  let Store;
  let storeFacade;

  let mockAction;
  let mockDispatcher;
  let mockDispatchToken;
  let mockGet;
  let mockInitialState;
  let mockResponse;
  let mockResponses;

  beforeEach(() => {
    Store = require('../Store.js');

    mockAction = 'INCREMENT';
    mockDispatchToken = 'test-token';
    mockDispatcher = {
      isDispatching: jest.genMockFn().mockReturnValue(true),
      register: jest.genMockFn().mockReturnValue(mockDispatchToken),
      unregister: jest.genMockFn(),
    };
    mockGet = jest.genMockFn().mockImpl((state) => state.count);
    mockResponse = jest.genMockFn().mockImpl((state) => {
      return {count: state.count + 1};
    });
    mockResponses = {};
    mockResponses[mockAction] = mockResponse;
    mockInitialState = {count: 0};
    storeFacade = new Store({
      getter: mockGet,
      initialState: mockInitialState,
      responses: mockResponses,
      dispatcher: mockDispatcher,
    });
  });

  it('registers with the dispatcher', () => {
    expect(mockDispatcher.register.mock.calls.length).toBe(1);
  });

  it('runs responses when the associated action is dispatched', () => {
    let handler = mockDispatcher.register.mock.calls[0][0];
    let mockData = {};
    handler({actionType: mockAction, data: mockData});
    expect(mockResponse.mock.calls.length).toBe(1);
    expect(mockResponse.mock.calls[0][0]).toBe(mockInitialState);
    expect(mockResponse.mock.calls[0][1]).toBe(mockData);
    expect(mockResponse.mock.calls[0][2]).toBe(mockAction);
  });

  it('calls the getter from get', () => {
    expect(storeFacade.get()).toBe(0);
  });

  it('passes args from get to the getter', () => {
    let mockArg1 = 'number 1';
    let mockArg2 = 'number 2';
    storeFacade.get(mockArg1, mockArg2);
    expect(mockGet.mock.calls[0].length).toBe(3);
    expect(mockGet.mock.calls[0].length).toBe(3);
    expect(mockGet.mock.calls[0][0]).toBe(mockInitialState);
    expect(mockGet.mock.calls[0][1]).toBe(mockArg1);
    expect(mockGet.mock.calls[0][2]).toBe(mockArg2);
  });

  it('returns the dispatch token from getDispatchToken', () => {
    expect(storeFacade.getDispatchToken()).toBe(mockDispatchToken);
  });

  it('runs listeners after a definedResponse', () => {
    let mockListener = jest.genMockFn();
    let mockEvent = require('../../event/Event.js').mock.instances[0];
    storeFacade.addOnChange(mockListener);

    let handler = mockDispatcher.register.mock.calls[0][0];
    handler({actionType: 'random action', data: {}});
    expect(mockEvent.runHandlers.mock.calls.length).toBe(0);

    handler({actionType: mockAction, data: {}});
    expect(mockEvent.runHandlers.mock.calls.length).toBe(1);
  });

  it('unregisters from the dispatcher on remove', () => {
    storeFacade.remove();
    expect(mockDispatcher.unregister.mock.calls.length).toBe(1);
    expect(mockDispatcher.unregister.mock.calls[0][0]).toBe(mockDispatchToken);
  });

  it('removes its event on remove', () => {
    let mockEvent = require('../../event/Event.js').mock.instances[0];
    storeFacade.remove();
    expect(mockEvent.remove.mock.calls.length).toBe(1);
  });

  it('returns null from get after remove', () => {
    storeFacade.remove();
    expect(storeFacade.get()).toBe(null);
  });

  it('does NOT run responses after it has been removed', () => {
    let handler = mockDispatcher.register.mock.calls[0][0];
    let mockData = {};
    storeFacade.remove();
    handler({actionType: mockAction, data: mockData});
    expect(mockResponse.mock.calls.length).toBe(0);
  });

  it('throws on an invalid dispatch', () => {
    let handler = mockDispatcher.register.mock.calls[0][0];
    expect(() => handler(null)).toThrow();
    expect(() => handler({})).toThrow();
    expect(() => handler({actionType: 'test!'})).not.toThrow();
  });

  it('properly tracks state updates', () => {
    let handler = mockDispatcher.register.mock.calls[0][0];
    expect(storeFacade.get()).toBe(0);
    handler({actionType: mockAction});
    expect(storeFacade.get()).toBe(1);
    handler({actionType: mockAction});
    expect(storeFacade.get()).toBe(2);
  });
});
