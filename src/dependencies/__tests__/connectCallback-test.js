jest.disableAutomock();
import connectCallback from '../connectCallback';
import { Dispatcher } from 'flux';
import StoreFactory from '../../store/StoreFactory';

describe('connect', () => {
  const ADD = 'ADD';
  const SUBTRACT = 'SUBTRACT';
  const CountStoreFactory = new StoreFactory({})
    .defineGet((state) => state)
    .defineGetInitialState(() => 1)
    .defineResponses({
      [ADD]: (state) => state + 1,
      [SUBTRACT]: (state) => state - 1,
    });

  let dispatcher;
  let FirstStore;
  let SecondStore;
  let dependencies;
  let callback;
  let fakeProps;
  let doConnect;
  let subscription;

  beforeEach(() => {
    callback = jest.fn();
    fakeProps = {
      add: 1,
    };
    dispatcher = new Dispatcher();
    dispatcher.register = jest.fn(dispatcher.register);
    dispatcher.unregister = jest.fn(dispatcher.unregister);
    dispatcher.waitFor = jest.fn(dispatcher.waitFor);
    FirstStore = CountStoreFactory.register(dispatcher);
    SecondStore = CountStoreFactory.register(dispatcher);
    dependencies = {
      count: {
        stores: [FirstStore, SecondStore],
        deref(props) {
          return FirstStore.get() + SecondStore.get() + props.add;
        },
      },
    };
    doConnect = connectCallback(dependencies, dispatcher);
    subscription = doConnect(callback, fakeProps);
  });

  afterEach(() => {
    subscription.remove();
  });

  it('recevies the available data immediately', () => {
    expect(callback.mock.calls[0][0]).toEqual({count: 3});
    expect(callback.mock.calls[0][1]).toEqual({});
    expect(typeof callback.mock.calls[0][2]).toBe('function');
  });

  it('respondes to actions', () => {
    dispatcher.dispatch({actionType: ADD});
    expect(callback.mock.calls.length).toBe(2);
    expect(callback.mock.calls[1][0]).toEqual({count: 5});
    expect(callback.mock.calls[1][1]).toEqual({count: 3});
    expect(typeof callback.mock.calls[1][2]).toBe('function');

    dispatcher.dispatch({actionType: SUBTRACT});
    expect(callback.mock.calls.length).toBe(3);
    expect(callback.mock.calls[2][0]).toEqual({count: 3});
    expect(callback.mock.calls[2][1]).toEqual({count: 5});
    expect(typeof callback.mock.calls[2][2]).toBe('function');
  });

  it('unregisters when subscription.remove is called', () => {
    subscription.remove();
    expect(dispatcher.unregister.mock.calls.length).toBe(1);
    dispatcher.dispatch({actionType: ADD});
    expect(callback.mock.calls.length).toBe(1);
  });

  it('unregisters when remove is called from the callback', () => {
    const removeCallback = jest.fn((s, p, remove) => remove());
    doConnect(removeCallback);
    expect(removeCallback.mock.calls.length).toBe(1);
    dispatcher.dispatch({actionType: ADD});
    expect(removeCallback.mock.calls.length).toBe(1);
  });
});
