jest.unmock('../Store');
jest.mock('../../event/Event');
import Event from '../../event/Event';

describe('Store', () => {
  let Store;
  let storeFacade;

  let mockAction;
  let mockDispatcher;
  let mockDispatchToken;
  let mockGet;
  let mockInitialState;
  let mockName;
  let mockResponse;
  let mockResponses;

  beforeEach(() => {
    Store = require('../Store').default;
    mockAction = 'INCREMENT';
    mockDispatchToken = 'test-token';
    mockDispatcher = {
      isDispatching: jest.fn(() => true),
      register: jest.fn(() => mockDispatchToken),
      unregister: jest.fn(),
    };
    mockGet = jest.fn(state => state.count);
    mockName = 'TestStore';
    mockResponse = jest.fn(state => {
      return { count: state.count + 1 };
    });
    mockResponses = {};
    mockResponses[mockAction] = mockResponse;
    mockInitialState = { count: 0 };
    storeFacade = new Store({
      getter: mockGet,
      initialState: mockInitialState,
      name: mockName,
      responses: mockResponses,
      dispatcher: mockDispatcher,
    });
  });

  it('registers with the dispatcher', () => {
    expect(mockDispatcher.register.mock.calls.length).toBe(1);
  });

  it('sets the name', () => {
    expect(storeFacade._name).toBe(mockName);
  });

  it('toStrings', () => {
    expect(storeFacade.toString()).toBe('TestStore<[object Object]>');
  });

  it('runs responses when the associated action is dispatched', () => {
    const handler = mockDispatcher.register.mock.calls[0][0];
    const mockData = {};
    handler({ actionType: mockAction, data: mockData });
    expect(mockResponse.mock.calls.length).toBe(1);
    expect(mockResponse.mock.calls[0][0]).toBe(mockInitialState);
    expect(mockResponse.mock.calls[0][1]).toBe(mockData);
    expect(mockResponse.mock.calls[0][2]).toBe(mockAction);
  });

  it(
    'runs responses when the associated action is dispatched with ' +
      'type/payload structure',
    () => {
      const handler = mockDispatcher.register.mock.calls[0][0];
      const mockData = {};
      handler({ type: mockAction, payload: mockData });
      expect(mockResponse.mock.calls.length).toBe(1);
      expect(mockResponse.mock.calls[0][0]).toBe(mockInitialState);
      expect(mockResponse.mock.calls[0][1]).toBe(mockData);
      expect(mockResponse.mock.calls[0][2]).toBe(mockAction);
    }
  );

  it('calls the getter from get', () => {
    expect(storeFacade.get()).toBe(0);
  });

  it('passes args from get to the getter', () => {
    const mockArg1 = 'number 1';
    const mockArg2 = 'number 2';
    storeFacade.get(mockArg1, mockArg2);
    expect(mockGet.mock.calls[0].length).toBe(3);
    expect(mockGet.mock.calls[0].length).toBe(3);
    expect(mockGet.mock.calls[0][0]).toBe(mockInitialState);
    expect(mockGet.mock.calls[0][1]).toBe(mockArg1);
    expect(mockGet.mock.calls[0][2]).toBe(mockArg2);
  });

  it('runs listeners after a definedResponse', () => {
    const mockListener = jest.fn();
    const mockEvent = Event.mock.instances[Event.mock.instances.length - 1];
    storeFacade.addOnChange(mockListener);

    const handler = mockDispatcher.register.mock.calls[0][0];
    handler({ actionType: 'random action', data: {} });
    expect(mockEvent.runHandlers.mock.calls.length).toBe(0);

    handler({ actionType: mockAction, data: {} });
    expect(mockEvent.runHandlers.mock.calls.length).toBe(1);
  });

  it('unregisters from the dispatcher on remove', () => {
    storeFacade.remove();
    expect(mockDispatcher.unregister.mock.calls.length).toBe(1);
    expect(mockDispatcher.unregister.mock.calls[0][0]).toBe(mockDispatchToken);
  });

  it('removes its event on remove', () => {
    const mockEvent = Event.mock.instances[Event.mock.instances.length - 1];
    storeFacade.remove();
    expect(mockEvent.remove.mock.calls.length).toBe(1);
  });

  it('returns null from get after remove', () => {
    storeFacade.remove();
    expect(storeFacade.get()).toBe(null);
  });

  it('does NOT run responses after it has been removed', () => {
    const handler = mockDispatcher.register.mock.calls[0][0];
    const mockData = {};
    storeFacade.remove();
    handler({ actionType: mockAction, data: mockData });
    expect(mockResponse.mock.calls.length).toBe(0);
  });

  it('throws on an invalid dispatch', () => {
    const handler = mockDispatcher.register.mock.calls[0][0];
    expect(() => handler(null)).toThrow();
    expect(() => handler({})).toThrow();
    expect(() => handler({ actionType: 'test!' })).not.toThrow();
  });

  it('properly tracks state updates', () => {
    const handler = mockDispatcher.register.mock.calls[0][0];
    expect(storeFacade.get()).toBe(0);
    handler({ actionType: mockAction });
    expect(storeFacade.get()).toBe(1);
    handler({ actionType: mockAction });
    expect(storeFacade.get()).toBe(2);
  });
});
