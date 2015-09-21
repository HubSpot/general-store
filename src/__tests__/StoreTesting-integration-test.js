jest.autoMockOff();

describe('Store testing integration test', () => {
  const {Dispatcher} = require('flux');
  const GeneralStore = require('../GeneralStore');

  const ADD_USER = 'ADD_USER';
  const REMOVE_USER = 'REMOVE_USER';

  const UserStoreFactory = GeneralStore.defineFactory()
    .defineGetInitialState(() => ({}))
    .defineResponses({
      [ADD_USER]: (users, newUser) => {
        users[newUser.id] = newUser;
        return users;
      },
      [REMOVE_USER]: (users, removeId) => {
        delete users[removeId];
        return users;
      },
    });

  let dispatcher;
  let storeInstance;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    storeInstance = UserStoreFactory.register(dispatcher);
  });

  it('always starts with a clean slate', () => {
    let first = storeInstance.get();
    let second = UserStoreFactory.register(dispatcher).get();
    expect(first).toEqual({});
    expect(second).toEqual({});
    expect(first).not.toBe(second);
  });

  it('responds to actions', () => {
    let ids = 0;
    dispatcher.dispatch({
      actionType: ADD_USER,
      data: {id: ++ids, name: 'User ' + ids},
    });
    dispatcher.dispatch({
      actionType: ADD_USER,
      data: {id: ++ids, name: 'User ' + ids},
    });
    dispatcher.dispatch({
      actionType: REMOVE_USER,
      data: 1,
    });
    expect(storeInstance.get()).toEqual({
      2: {
        id: 2,
        name: 'User 2',
      },
    });
  });
});
