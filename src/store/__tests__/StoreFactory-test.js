jest.dontMock('../StoreFactory.js');

const EMPTY_FUNC = () => {};

describe('StoreFactory', () => {
  let StoreFactory;
  let storeFactory;

  beforeEach(() => {
    StoreFactory = require('../StoreFactory.js').default;
    storeFactory = new StoreFactory({});
  });

  it('sets the default definition', () => {
    const {getInitialState, getter, ...rest} = storeFactory.getDefinition();
    expect(typeof getInitialState).toBe('function');
    expect(typeof getter).toBe('function');
    expect(rest).toEqual({
      responses: {},
    });
  });

  it('returns a new store', () => {
    expect(
      storeFactory.defineGet(EMPTY_FUNC)
    ).not.toBe(storeFactory);
    expect(
      storeFactory.defineResponses({})
    ).not.toBe(storeFactory);
    expect(
      storeFactory.defineGetInitialState(EMPTY_FUNC)
    ).not.toBe(storeFactory);
  });

  it('sets getter', () => {
    const mockGetter = EMPTY_FUNC;
    const newDef = storeFactory.defineGet(mockGetter).getDefinition();
    expect(newDef.getter).toBe(mockGetter);
  });

  it('throws when a getter is already set', () => {
    const factoryWithGetter = storeFactory.defineGet(EMPTY_FUNC);
    expect(
      () => factoryWithGetter.defineGet(EMPTY_FUNC)
    ).toThrow();
  });

  it('sets getInitialState', () => {
    const mockStateGetter = EMPTY_FUNC;
    const newDef = storeFactory
      .defineGetInitialState(mockStateGetter)
      .getDefinition();
    expect(newDef.getInitialState).toBe(mockStateGetter);
  });

  it('throws when getInitialState is not a function', () => {
    expect(() => storeFactory.defineGetInitialState({})).toThrow();
  });

  it('throws when initialState is already set', () => {
    const emptyFn = EMPTY_FUNC;
    const factoryWithGetInitialState = storeFactory
      .defineGetInitialState(emptyFn);
    expect(
      () => factoryWithGetInitialState.defineGetInitialState(emptyFn)
    ).toThrow();
  });

  it('sets responses', () => {
    const mockResponses = {
      TEST: EMPTY_FUNC,
      TEST_TWO: EMPTY_FUNC,
    };
    const newDef = storeFactory.defineResponses(mockResponses).getDefinition();
    Object.keys(mockResponses).forEach(actionType => {
      expect(newDef.responses[actionType]).toBe(mockResponses[actionType]);
    });
  });

  it('throws when a response is already set', () => {
    const factoryWithResponses = storeFactory.defineResponses({
      TEST: EMPTY_FUNC,
      TEST_TWO: EMPTY_FUNC,
    });
    expect(
      () => factoryWithResponses.defineResponses({
        TEST_THREE: EMPTY_FUNC,
      })
    ).not.toThrow();
    expect(
      () => factoryWithResponses.defineResponses({
        TEST: EMPTY_FUNC,
      })
    ).toThrow();
  });

  it('validates the actionType(s) passed to defineResponses', () => {
    const mockResponse = EMPTY_FUNC;
    // invalid args
    expect(
      () => storeFactory.defineResponses({'TESTING': null})
    ).toThrow();
    expect(() => storeFactory.defineResponses(mockResponse)).toThrow();
    expect(() => storeFactory.defineResponses('testAction')).toThrow();
    expect(() => storeFactory.defineResponses('testAction', [])).toThrow();

    // valid args
    expect(() => {
      storeFactory.defineResponses({'testAction': mockResponse});
    }).not.toThrow();

    // valid array of actions
    expect(() => {
      storeFactory.defineResponses({
        testAction1: mockResponse,
        testAction2: mockResponse,
      });
    }).not.toThrow();

    // duplicates should throw
    expect(() => {
      storeFactory.defineResponses({
        'testAction': mockResponse,
      }).defineResponses({
        'testAction': mockResponse,
      });
    }).toThrow();
  });

  it('throws if register is called without a valid dispatcher', () => {
    const mockDispatcher = {
      register: () => 12345,
      unregister: EMPTY_FUNC,
    };
    storeFactory.defineGet(EMPTY_FUNC);
    expect(() => {
      storeFactory.register({});
    }).toThrow();
    expect(() => {
      storeFactory.register(mockDispatcher);
    }).not.toThrow();
  });
});
