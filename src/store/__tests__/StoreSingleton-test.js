import * as DispatcherInstance from '../../dispatcher/DispatcherInstance';
const StoreSingleton = jest.requireActual('../StoreSingleton').default;

const EMPTY_FUNC = () => {};

describe('StoreSingleton', () => {
  let mockDispatcher;
  let storeDefinition;

  beforeEach(() => {
    mockDispatcher = {
      register: () => 12345,
      unregister: EMPTY_FUNC,
    };
    jest.spyOn(DispatcherInstance, 'get').mockReturnValue(mockDispatcher);
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

  it('calls through to defineName on the factory', () => {
    const storeName = 'TestStore';
    spyOn(storeDefinition._factory, 'defineName');
    storeDefinition.defineName(storeName);
    expect(storeDefinition._factory.defineName).toHaveBeenCalledWith(storeName);
  });

  it('throws if define* are called after register', () => {
    storeDefinition.defineGet(EMPTY_FUNC).register(mockDispatcher);
    expect(() =>
      storeDefinition.defineResponseTo('test', EMPTY_FUNC)
    ).toThrow();
    expect(() => storeDefinition.defineGet(EMPTY_FUNC)).toThrow();
  });
});
