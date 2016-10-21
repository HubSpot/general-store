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
    expect(callback.mock.calls[0][0]).toBe(null);
    expect(callback.mock.calls[0][1]).toEqual({count: 3});
    expect(callback.mock.calls[0][2]).toEqual({});
    expect(typeof callback.mock.calls[0][3]).toBe('function');
  });

  it('catches an initial exception', (done) => {
    const mockError = new Error();
    connectCallback({
      test: {
        stores: [],
        deref() {
          throw mockError;
        },
      },
    }, dispatcher)((error) => {
      expect(error).toBe(mockError);
      done();
    });
  });

  it('respondes to actions', () => {
    dispatcher.dispatch({actionType: ADD});
    expect(callback.mock.calls.length).toBe(2);
    expect(callback.mock.calls[1][0]).toBe(null);
    expect(callback.mock.calls[1][1]).toEqual({count: 5});
    expect(callback.mock.calls[1][2]).toEqual({count: 3});
    expect(typeof callback.mock.calls[1][3]).toBe('function');

    dispatcher.dispatch({actionType: SUBTRACT});
    expect(callback.mock.calls.length).toBe(3);
    expect(callback.mock.calls[2][0]).toBe(null);
    expect(callback.mock.calls[2][1]).toEqual({count: 3});
    expect(callback.mock.calls[2][2]).toEqual({count: 5});
    expect(typeof callback.mock.calls[2][3]).toBe('function');
  });

  it('catches an exception in an update', (done) => {
    const mockError = new Error();
    let callbackCount = 0;
    let derefCount = 0;
    connectCallback({
      test: {
        stores: [FirstStore],
        deref() {
          if (derefCount > 0) {
            throw mockError;
          } else {
            derefCount++;
          }
        },
      },
    }, dispatcher)((error) => {
      if (callbackCount > 0) {
        expect(error).toBe(mockError);
        done();
      } else {
        expect(error).toBe(null);
        callbackCount++;
      }
    });
    dispatcher.dispatch({actionType: ADD});
  });

  it('unregisters when subscription.remove is called', () => {
    subscription.remove();
    expect(dispatcher.unregister.mock.calls.length).toBe(1);
    dispatcher.dispatch({actionType: ADD});
    expect(callback.mock.calls.length).toBe(1);
  });

  it('unregisters when remove is called from the callback', () => {
    const removeCallback = jest.fn((e, s, p, remove) => remove());
    doConnect(removeCallback, fakeProps);
    expect(removeCallback.mock.calls.length).toBe(1);
    dispatcher.dispatch({actionType: ADD});
    expect(removeCallback.mock.calls.length).toBe(1);
  });
});
