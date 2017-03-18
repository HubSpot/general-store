jest.unmock('../StoreSingleton.js');

const EMPTY_FUNC = () => {};

describe('StoreSingleton', () => {
  let DispatcherInstance;
  let StoreSingleton;

  let mockDispatcher;
  let storeDefinition;

  beforeEach(() => {
    DispatcherInstance = require('../../dispatcher/DispatcherInstance.js');
    StoreSingleton = require('../StoreSingleton.js').default;

    mockDispatcher = {
      register: () => 12345,
      unregister: EMPTY_FUNC,
    };
    DispatcherInstance.get.mockReturnValue(mockDispatcher);
    storeDefinition = new StoreSingleton();
  });

  it('ensures that a function is passed to defineGet', () => {
    // invalid args
    expect(() => storeDefinition.defineGet({})).toThrow();
    expect(() => storeDefinition.defineGet(null)).toThrow();
    expect(() => storeDefinition.defineGet()).toThrow();

    // valid args
    expect(() => storeDefinition.defineGet(EMPTY_FUNC)).not.toThrow();
  });

  it('throws if define* are called after register', () => {
    storeDefinition.defineGet(EMPTY_FUNC).register(mockDispatcher);
    expect(() =>
      storeDefinition.defineResponseTo('test', EMPTY_FUNC)).toThrow();
    expect(() => storeDefinition.defineGet(EMPTY_FUNC)).toThrow();
  });
});
