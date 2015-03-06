jest.autoMockOff();

function runTest(GeneralStore) {

  var Flux;

  var ADD_USER = 'ADD_USER';
  var REMOVE_USER = 'REMOVE_USER';

  var dispatcher;
  var mockUser;
  var UserStore;

  function merge(state, updates) {
    var merged = {};
    for (var stateKey in state) {
      merged[stateKey] = state[stateKey];
    }
    for (var updatesKey in updates) {
      merged[updatesKey] = updates[updatesKey];
    }
    return merged;
  }

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

  function defineMockComponent() {
    var mockComponent = {
      props: {},
      state: {},
      setState: jest.genMockFn().mockImpl((updates) => {
        mockComponent.state = merge(
          mockComponent.state,
          updates
        );
      })
    };
    return mockComponent;
  }

  function defineUserCountStore() {
    var userCount = 0;
    return GeneralStore.define()
      .defineGet(() => userCount)
      .defineResponseTo(ADD_USER, () => userCount++)
      .defineResponseTo(REMOVE_USER, () => userCount--)
      .register(dispatcher);
  }

  function defineUserStore() {
    var users = {};
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
    mockUser = {
      id: '123',
      name: 'Test Person'
    };

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
    var mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore
    });
    var mockComponent = defineMockComponent();
    mockComponent.setState(
      mockMixin.getInitialState.call(mockComponent)
    );
    mockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {}
    });
    addUser(mockUser);
    expect(mockComponent.setState.mock.calls.length).toBe(2);
    expect(mockComponent.state).toEqual({
      users: {
        '123': mockUser
      }
    });
  });

  it('triggers ONE update for fields with a common Store', () => {
    var mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore,
      userIds: {
        stores: [UserStore],
        deref: () => Object.keys(UserStore.get())
      }
    });
    var mockComponent = defineMockComponent();
    mockComponent.setState(
      mockMixin.getInitialState.call(mockComponent)
    );
    mockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {},
      userIds: []
    });
    addUser(mockUser);
    expect(mockComponent.setState.mock.calls.length).toBe(2);
    expect(mockComponent.state).toEqual({
      users: {
        '123': mockUser
      },
      userIds: [
        mockUser.id
      ]
    });
  });

  it('triggers ONE update for multiple mixins with a common store', () => {
    var mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore
    });
    var otherMockMixin = GeneralStore.StoreDependencyMixin({
      otherUsers: UserStore
    });
    var mockComponent = defineMockComponent();
    mockComponent.setState(
      mockMixin.getInitialState.call(mockComponent)
    );
    mockComponent.setState(
      otherMockMixin.getInitialState.call(mockComponent)
    );
    mockMixin.componentWillMount.call(mockComponent);
    otherMockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.setState.mock.calls.length).toBe(2);
    addUser(mockUser);
    expect(mockComponent.setState.mock.calls.length).toBe(3);
    expect(mockComponent.state).toEqual({
      users: {
        '123': mockUser
      },
      otherUsers: {
        '123': mockUser
      },
    });
  });

  it('triggers ONE update for stores that respond to a common action', () => {
    var UserCountStore = defineUserCountStore();
    var mockComponent = defineMockComponent();
    var mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore,
      userCount: UserCountStore
    });
    mockComponent.setState(
      mockMixin.getInitialState.call(mockComponent)
    );
    mockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {},
      userCount: 0
    });
    addUser(mockUser);
    expect(mockComponent.state).toEqual({
      users: {
        '123': mockUser
      },
      userCount: 1
    });
    expect(mockComponent.setState.mock.calls.length).toBe(2);
  });

  it('triggers ONE update for stores across mixins that respond to a common action', () => {
    var UserCountStore = defineUserCountStore();
    var mockComponent = defineMockComponent();
    var mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore,
    });
    var otherMockMixin = GeneralStore.StoreDependencyMixin({
      userCount: UserCountStore
    });
    mockComponent.setState(
      mockMixin.getInitialState.call(mockComponent)
    );
    mockComponent.setState(
      otherMockMixin.getInitialState.call(mockComponent)
    );
    mockMixin.componentWillMount.call(mockComponent);
    otherMockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {},
      userCount: 0
    });
    addUser(mockUser);
    expect(mockComponent.state).toEqual({
      users: {
        '123': mockUser
      },
      userCount: 1
    });
    expect(mockComponent.setState.mock.calls.length).toBe(3);
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

