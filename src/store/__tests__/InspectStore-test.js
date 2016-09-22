jest.unmock('../InspectStore');
jest.unmock('../Store');
jest.unmock('../StoreFactory');

describe('InspectStore', () => {
  let InspectStore;
  let StoreFactory;

  const FIRST_ACTION = 'FIRST_ACTION';
  const SECOND_ACTION = 'SECOND_ACTION';

  let dispatcher;
  let dispatchToken;
  let factory;
  let firstHandler;
  let getter;
  let secondHandler;
  let store;

  beforeEach(() => {
    InspectStore = require('../InspectStore');
    StoreFactory = require('../StoreFactory').default;

    dispatchToken = 'testing_1';
    dispatcher = {
      isDispatching: jest.genMockFn().mockReturnValue(true),
      register: jest.genMockFn().mockReturnValue(dispatchToken),
      unregister: jest.genMockFn(),
    };
    getter = (state) => state;
    firstHandler = jest.genMockFn();
    secondHandler = jest.genMockFn();

    factory = new StoreFactory({})
      .defineGet(getter)
      .defineGetInitialState(() => {
        return {testing: 'yes'};
      })
      .defineResponseTo(FIRST_ACTION, firstHandler)
      .defineResponseTo(SECOND_ACTION, secondHandler);
    store = factory.register(dispatcher);
  });

  it('getDispatcher', () => {
    expect(InspectStore.getDispatcher(store)).toBe(dispatcher);
  });

  it('getDispatchToken', () => {
    expect(InspectStore.getDispatchToken(store)).toBe(dispatchToken);
  });

  it('getActionTypes', () => {
    expect(InspectStore.getDispatchToken(store)).toBe(dispatchToken);
  });

  it('getGetter', () => {
    expect(InspectStore.getGetter(store)).toBe(getter);
  });

  it('getId', () => {
    expect(InspectStore.getId(store)).toBe(store._uid);
  });

  it('getFactory', () => {
    expect(InspectStore.getFactory(store)).toBe(factory);
  });

  it('getResponses', () => {
    expect(InspectStore.getResponses(store)).toEqual({
      FIRST_ACTION: firstHandler,
      SECOND_ACTION: secondHandler,
    });
  });

  it('getState', () => {
    expect(InspectStore.getState(store)).toEqual({testing: 'yes'});
  });
});
