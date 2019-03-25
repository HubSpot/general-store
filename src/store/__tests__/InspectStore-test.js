jest.unmock('../InspectStore');
jest.unmock('../Store');
jest.unmock('../StoreFactory');
import * as InspectStore from '../InspectStore';
import StoreFactory from '../StoreFactory';

describe('InspectStore', () => {
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
    dispatchToken = 'testing_1';
    dispatcher = {
      isDispatching: jest.fn(() => true),
      register: jest.fn(() => dispatchToken),
      unregister: jest.fn(),
    };
    getter = state => state;
    firstHandler = jest.fn();
    secondHandler = jest.fn();

    factory = new StoreFactory({})
      .defineName('TestStore')
      .defineGet(getter)
      .defineGetInitialState(() => {
        return { testing: 'yes' };
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

  it('getName', () => {
    expect(InspectStore.getName(store)).toBe('TestStore');
  });

  it('getResponses', () => {
    expect(InspectStore.getResponses(store)).toEqual({
      FIRST_ACTION: firstHandler,
      SECOND_ACTION: secondHandler,
    });
  });

  it('getState', () => {
    expect(InspectStore.getState(store)).toEqual({ testing: 'yes' });
  });

  it('isStore', () => {
    expect(InspectStore.isStore({})).toBe(false);
    expect(InspectStore.isStore(store)).toBe(true);
  });
});
