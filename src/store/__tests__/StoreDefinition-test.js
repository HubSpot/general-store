jest
  .dontMock('../StoreConstants.js')
  .dontMock('../StoreDefinition.js');

var mocks = require('mock-modules');

describe('StoreDefinition', () => {

  var DispatcherInstance;
  var StoreDefinition;

  var mockDispatcher;
  var storeDefinition;

  beforeEach(() => {
    DispatcherInstance = require('../../dispatcher/DispatcherInstance.js');
    StoreDefinition = require('../StoreDefinition.js');

    mockDispatcher = {register: function() {return 12345;}};
    DispatcherInstance.get.mockReturnValue(mockDispatcher);
    storeDefinition = new StoreDefinition()
  });

  it('ensures that a function is passed to defineGet', () => {
    // invalid args
    expect(() => storeDefinition.defineGet({})).toThrow();
    expect(() => storeDefinition.defineGet(null)).toThrow();
    expect(() => storeDefinition.defineGet()).toThrow();

    // valid args
    expect(() => storeDefinition.defineGet(function() {})).not.toThrow();
  });

  it('validates the actionType passed to defineResponseTo', () => {
    var mockResponse = function() {};
    // invalid args
    expect(() => storeDefinition.defineResponseTo(null, mockResponse)).toThrow()
    expect(() => storeDefinition.defineResponseTo(mockResponse)).toThrow()
    expect(() => storeDefinition.defineResponseTo('testAction')).toThrow()
    expect(() => storeDefinition.defineResponseTo('testAction', [])).toThrow()

    // valid args
    expect(() => {
      storeDefinition.defineResponseTo('testAction', mockResponse);
    }).not.toThrow()

    // duplicates should throw
    expect(() => {
      storeDefinition.defineResponseTo('testAction', mockResponse)
    }).toThrow()
  });

  it('throws if define* are called after register', () => {
    storeDefinition
      .defineGet(function() {})
      .register(mockDispatcher);
    expect(() => storeDefinition.defineResponseTo('test', function() {})).toThrow()
    expect(() => storeDefinition.defineGet(function() {})).toThrow()
  });

  it('throws if register is called without a valid dispatcher', () => {
    storeDefinition.defineGet(function() {});
    expect(() => {
      storeDefinition.register({});
    }).toThrow();
    expect(() => {
      storeDefinition.register(mockDispatcher);
    }).not.toThrow();
  });

  it('passes along the getter to the StoreFacade on register', () => {
    var StoreFacade = require('../StoreFacade.js');
    var mockGet = function() {return 'get!'};
    storeDefinition
      .defineGet(mockGet)
      .register(mockDispatcher);
    expect(StoreFacade.mock.calls[0][0]).toBe(mockGet);
  });

  it('passes along responses to the StoreFacade on register', () => {
    var mockActionType = 'test-action';
    var mockResponse = function() {};
    var StoreFacade = require('../StoreFacade.js');
    storeDefinition
      .defineGet(function() {})
      .defineResponseTo(mockActionType, mockResponse)
      .register(mockDispatcher);
    expect(StoreFacade.mock.calls[0][1][mockActionType]).toBe(mockResponse);
  });

  it('passes along the dispatcher to the StoreFacade on register', () => {
    var StoreFacade = require('../StoreFacade.js');
    storeDefinition
      .defineGet(function() {})
      .register(mockDispatcher);
    expect(StoreFacade.mock.calls[0][2]).toBe(mockDispatcher);
  });

});
