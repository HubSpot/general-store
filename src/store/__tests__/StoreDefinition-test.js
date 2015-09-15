jest.dontMock('../StoreDefinition.js');

describe('StoreDefinition', () => {

  var DispatcherInstance;
  var StoreDefinition;

  var mockDispatcher;
  var storeDefinition;

  beforeEach(() => {
    DispatcherInstance = require('../../dispatcher/DispatcherInstance.js');
    StoreDefinition = require('../StoreDefinition.js');

    mockDispatcher = {
      register: () => 12345,
      unregister: function() {},
    };
    DispatcherInstance.get.mockReturnValue(mockDispatcher);
    storeDefinition = new StoreDefinition();
  });

  it('ensures that a function is passed to defineGet', () => {
    // invalid args
    expect(() => storeDefinition.defineGet({})).toThrow();
    expect(() => storeDefinition.defineGet(null)).toThrow();
    expect(() => storeDefinition.defineGet()).toThrow();

    // valid args
    expect(() => storeDefinition.defineGet(function() {})).not.toThrow();
  });

  it('throws if define* are called after register', () => {
    storeDefinition
      .defineGet(function() {})
      .register(mockDispatcher);
    expect(
      () => storeDefinition.defineResponseTo('test', function() {})
    ).toThrow();
    expect(() => storeDefinition.defineGet(function() {})).toThrow();
  });

});
