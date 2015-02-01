jest
  .dontMock('../StoreConstants.js')
  .dontMock('../StoreFacade.js');

describe('StoreFacade', () => {

  var StoreFacade;

  var mockAction;
  var mockDispatcher;
  var mockDispatchToken;
  var mockGet;
  var mockGetValue;
  var mockResponse;
  var mockResponses;

  beforeEach(() => {
    StoreFacade = require('../StoreFacade.js');

    mockAction = 'MOCK_ACTION';
    mockDispatchToken = 'test-token';
    mockDispatcher = {
      register: jest.genMockFn().mockReturnValue(mockDispatchToken)
    };
    mockGetValue = 'mock value';
    mockGet = jest.genMockFn().mockReturnValue(mockGetValue);
    mockResponse = jest.genMockFn();
    mockResponses = {};
    mockResponses[mockAction] = mockResponse;
    storeFacade = new StoreFacade(
      mockGet,
      mockResponses,
      mockDispatcher
    );
  });

  it('registers with the dispatcher', () => {
    expect(mockDispatcher.register.mock.calls.length).toBe(1)
  });

  it('runs responses when the associated action is dispatched', () => {
    var handler = mockDispatcher.register.mock.calls[0][0];
    var mockData = {};
    handler({actionType: mockAction, data: mockData});
    expect(mockResponse.mock.calls.length).toBe(1);
    expect(mockResponse.mock.calls[0][0]).toBe(mockData);
    expect(mockResponse.mock.calls[0][1]).toBe(mockAction);
  });

  it('calls the getter from get', () => {
    expect(storeFacade.get()).toBe(mockGetValue);
  });

  it('passes args from get to the getter', () => {
    var mockArg1 = 'number 1';
    var mockArg2 = 'number 2';
    storeFacade.get(mockArg1, mockArg2);
    expect(mockGet.mock.calls[0].length).toBe(2);
    expect(mockGet.mock.calls[0].length).toBe(2);
    expect(mockGet.mock.calls[0][0]).toBe(mockArg1);
    expect(mockGet.mock.calls[0][1]).toBe(mockArg2);
  });

  it('returns the dispatch token from getDispatchToken', () => {
    expect(storeFacade.getDispatchToken()).toBe(mockDispatchToken);
  });

  it('runs listeners after a definedResponse', () => {
    var mockListener = jest.genMockFn();
    var mockEvent = require('../../event/Event.js').mock.instances[0];
    storeFacade.addOnChange(mockListener);

    var handler = mockDispatcher.register.mock.calls[0][0];
    handler({actionType: 'random action', data: {}});
    expect(mockEvent.runHandlers.mock.calls.length).toBe(0);

    handler({actionType: mockAction, data: {}});
    expect(mockEvent.runHandlers.mock.calls.length).toBe(1);
  });

});

