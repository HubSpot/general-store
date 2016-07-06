jest.disableAutomock();

function runTest(GeneralStore) {
  let Flux;

  const ADD_USER = 'ADD_USER';
  const REMOVE_USER = 'REMOVE_USER';

  let dispatcher;
  let mockUser;
  let UserStore;

  function merge(state, updates) {
    const merged = {};
    for (const stateKey in state) {
      if (state.hasOwnProperty(stateKey)) {
        merged[stateKey] = state[stateKey];
      }
    }
    for (const updatesKey in updates) {
      if (updates.hasOwnProperty(updatesKey)) {
        merged[updatesKey] = updates[updatesKey];
      }
    }
    return merged;
  }

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

  function defineMockComponent() {
    const mockComponent = {
      props: {},
      state: {},
      setState: jest.fn((updates) => {
        mockComponent.state = merge(
          mockComponent.state,
          updates
        );
      }),
    };
    return mockComponent;
  }

  function defineCountStore(incAction, decAction) {
    return GeneralStore.defineFactory()
      .defineGet(count => count)
      .defineGetInitialState(() => 0)
      .defineResponses({
        [incAction]: (count) => count + 1,
        [decAction]: (count) => {
          return count > 0 ? count - 1 : count;
        }
      });
  }

  function defineUserCountStore() {
    return defineCountStore(ADD_USER, REMOVE_USER).register(dispatcher);
  }

  function defineUserStore() {
    const users = {};
    return GeneralStore.define()
      .defineGet(() => users)
      .defineResponseTo(
        ADD_USER,
        user => {
          users[user.id] = user;
        }
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
      name: 'Test Person',
    };

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
    const mockChangeHandler = jest.genMockFn();
    const otherMockChangeHandler = jest.genMockFn();
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
    const mockChangeHandler = jest.genMockFn();
    const removedMockChangeHandler = jest.genMockFn();
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

  it('set the expected state on store change', () => {
    const mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore,
    }, dispatcher);
    const mockComponent = defineMockComponent();
    mockComponent.state = mockMixin.getInitialState.call(mockComponent);
    mockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {},
    });
    addUser(mockUser);
    expect(mockComponent.setState.mock.calls.length).toBe(1);
    expect(mockComponent.state).toEqual({
      users: {
        '123': mockUser,
      },
    });
  });

  it('triggers ONE update for fields with a common Store', () => {
    const mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore,
      userIds: {
        stores: [UserStore],
        deref: () => Object.keys(UserStore.get()),
      },
    }, dispatcher);
    const mockComponent = defineMockComponent();
    mockComponent.state = mockMixin.getInitialState.call(mockComponent);
    mockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {},
      userIds: [],
    });
    addUser(mockUser);
    expect(mockComponent.setState.mock.calls.length).toBe(1);
    expect(mockComponent.state).toEqual({
      users: {
        [mockUser.id]: mockUser,
      },
      userIds: [
        mockUser.id,
      ],
    });
  });

  it('triggers ONE update for stores that respond to a common action', () => {
    const UserCountStore = defineUserCountStore();
    const mockComponent = defineMockComponent();
    const mockMixin = GeneralStore.StoreDependencyMixin({
      users: UserStore,
      userCount: UserCountStore,
    }, dispatcher);
    mockComponent.state = mockMixin.getInitialState.call(mockComponent);
    mockMixin.componentWillMount.call(mockComponent);
    expect(mockComponent.state).toEqual({
      users: {},
      userCount: 0,
    });
    addUser(mockUser);
    expect(mockComponent.state).toEqual({
      users: {
        '123': mockUser,
      },
      userCount: 1,
    });
    expect(mockComponent.setState.mock.calls.length).toBe(1);
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
    require('../../dist/general-store.js')
  );
});

describe('GeneralStore prod build integration test', () => {
  runTest(
    require('../../dist/general-store.min.js')
  );
});
