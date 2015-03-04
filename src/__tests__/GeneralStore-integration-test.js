jest.autoMockOff();

function runTest(GeneralStore) {

  var Flux;

  var ADD_USER = 'ADD_USER';
  var REMOVE_USER = 'REMOVE_USER';

  var dispatcher;
  var users;
  var UserStore;

  function addUser(user) {
    dispatcher.dispatch({
      actionType: ADD_USER,
      data: user
    });
  }

  function removeUser(user) {
    dispatcher.dispatch({
      actionType: REMOVE_USER,
      data: user
    });
  }

  function defineUserStore() {
    return GeneralStore.define()
      .defineGet(() => users)
      .defineResponseTo(
        ADD_USER,
        user => users[user.id] = user
      )
      .defineResponseTo(
        REMOVE_USER,
        user => delete users[user.id]
      )
      .register(dispatcher);
  }

  beforeEach(() => {
    Flux = require('flux');
    dispatcher = new Flux.Dispatcher();
    users = {};

    UserStore = defineUserStore();
  });

  it('should add users to the store on ADD_USER', () => {
    var userId = 123;
    var user = {
      id: userId,
      name: 'Test Person'
    };
    addUser(user);
    expect(Object.keys(UserStore.get()).length).toBe(1);
    expect(UserStore.get()[userId]).toBe(user);
  });

  it('should not throw on valid payload', () => {
    expect(() => {
      dispatcher.dispatch({
        actionType: 'MOCK_ACTION',
        data: {}
      });
    }).not.toThrow();
  });

  it('should remove users from the store on REMOVE_USER', () => {
    var userId = 123;
    var user = {
      id: userId,
      name: 'Test Person'
    };
    addUser(user);
    removeUser(user);
    expect(Object.keys(UserStore.get()).length).toBe(0);
    expect(UserStore.get()[userId]).toBe(undefined);
  });

  it('should run listeners onChange', () => {
    var mockChangeHandler = jest.genMockFn();
    var otherMockChangeHandler = jest.genMockFn();
    var userId = 123;
    var user = {
      id: userId,
      name: 'Test Person'
    };
    UserStore.addOnChange(mockChangeHandler);
    UserStore.addOnChange(otherMockChangeHandler);
    addUser(user);
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(otherMockChangeHandler.mock.calls.length).toBe(1);
  });

  it('should NOT run listeners that have been removed onChange', () => {
    var mockChangeHandler = jest.genMockFn();
    var removedMockChangeHandler = jest.genMockFn();
    var userId = 123;
    var user = {
      id: userId,
      name: 'Test Person'
    };
    UserStore.addOnChange(mockChangeHandler);
    var removedMockHandler = UserStore.addOnChange(removedMockChangeHandler);
    removedMockHandler.remove();
    addUser(user);
    expect(mockChangeHandler.mock.calls.length).toBe(1);
    expect(removedMockChangeHandler.mock.calls.length).toBe(0);
  });

  it('set the expected state on store change', () => {
    var {mergeState} = require('../mixin/StoreDependencyMixinTransitions.js');
    var mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore,
      userIds: {
        stores: [UserStore],
        deref: () => Object.keys(UserStore.get())
      }
    });
    var mockComponent = {
      props: {},
      state: {},
      setState: jest.genMockFn().mockImpl((updates) => {
        mockComponent.state = mergeState(
          mockComponent.state,
          updates
        );
      })
    };
    mockComponent.setState(
      mockMixin.getInitialState.call(mockComponent)
    );
    mockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {},
      userIds: []
    });
    addUser({
      id: '123',
      name: 'Test Guy'
    });
    expect(mockComponent.setState.mock.calls.length).toBe(2);
    expect(mockComponent.state).toEqual({
      users: {
        '123': {
          id: 123,
          name: 'Test Guy'
        }
      },
      userIds: [
        '123'
      ]
    });
  });

}

/**
 * Just for sanity's sake, we run this basic integration test against
 * the source, dev, and prod builds of GeneralStore.
 */
describe('GeneralStore src integration test', () => {
  runTest(
    require('../GeneralStore.js')
  );
});

describe('GeneralStore dev build integration test', () => {
  runTest(
    require('../../build/general-store.js')
  );
});

describe('GeneralStore prod build integration test', () => {
  runTest(
    require('../../build/general-store.min.js')
  );
});

