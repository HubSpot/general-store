jest.disableAutomock();

function runTest(GeneralStore) {
  let Flux;

  const ADD_USER = 'ADD_USER';
  const REMOVE_USER = 'REMOVE_USER';

  let dispatcher;
  let UserStore;

  function addUser(user) {
    dispatcher.dispatch({
      actionType: ADD_USER,
      data: user,
    });
  }

  function removeUser(user) {
    dispatcher.dispatch({
      actionType: REMOVE_USER,
      data: user,
    });
  }

  function defineUserStore() {
    const users = {};
    return GeneralStore.define()
      .defineGet(() => users)
      .defineResponseTo(ADD_USER, user => {
        users[user.id] = user;
      })
      .defineResponseTo(REMOVE_USER, user => delete users[user.id])
      .register(dispatcher);
  }

  beforeEach(() => {
    Flux = require('flux');
    dispatcher = new Flux.Dispatcher();
    UserStore = defineUserStore();
  });

  it('should add users to the store on ADD_USER', () => {
    const userId = 123;
    const user = {
      id: userId,
      name: 'Test Person',
    };
    addUser(user);
    expect(UserStore.get()[userId]).toBe(user);
  });

  it('should not throw on valid payload', () => {
    expect(() => {
      dispatcher.dispatch({
        actionType: 'MOCK_ACTION',
        data: {},
      });
    }).not.toThrow();
  });

  it('should remove users from the store on REMOVE_USER', () => {
    const userId = 123;
    const user = {
      id: userId,
      name: 'Test Person',
    };
    addUser(user);
    removeUser(user);
    expect(Object.keys(UserStore.get()).length).toBe(0);
    expect(UserStore.get()[userId]).toBe(undefined);
  });

  it('should run listeners onChange', () => {
    const mockChangeHandler = jest.fn();
    const otherMockChangeHandler = jest.fn();
    const userId = 123;
    const user = {
      id: userId,
      name: 'Test Person',
    };
    UserStore.addOnChange(mockChangeHandler);
    UserStore.addOnChange(otherMockChangeHandler);
    addUser(user);
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(otherMockChangeHandler.mock.calls.length).toBe(1);
  });

  it('should NOT run listeners that have been removed onChange', () => {
    const mockChangeHandler = jest.fn();
    const removedMockChangeHandler = jest.fn();
    const userId = 123;
    const user = {
      id: userId,
      name: 'Test Person',
    };
    UserStore.addOnChange(mockChangeHandler);
    const removedMockHandler = UserStore.addOnChange(removedMockChangeHandler);
    removedMockHandler.remove();
    addUser(user);
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(removedMockChangeHandler.mock.calls.length).toBe(0);
  });
}

/**
 * Just for sanity's sake, we run this basic integration test against
 * the source, dev, and prod builds of GeneralStore.
 */
describe('GeneralStore src integration test', () => {
  runTest(require('../GeneralStore'));
});

describe('GeneralStore dev build integration test', () => {
  runTest(require('../../dist/general-store'));
});

describe('GeneralStore prod build integration test', () => {
  runTest(require('../../dist/general-store.min'));
});
