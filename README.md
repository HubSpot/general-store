![HubSpot/general-store](https://cloud.githubusercontent.com/assets/478109/6376307/1d3c77dc-bceb-11e4-9a96-0a909810cc69.png)

[![NPM version](http://img.shields.io/npm/v/general-store.svg)](https://www.npmjs.com/package/general-store)
[![Build Status](https://travis-ci.org/HubSpot/general-store.svg?branch=master)](https://travis-ci.org/HubSpot/general-store)

`general-store` aims to provide all the features of a [Flux](http://facebook.github.io/flux/) store without prescribing the implementation of that store's data or mutations.

Briefly, a store:

1. contains any arbitrary value
2. exposes that value via a get method
3. responds to specific events from the dispatcher
4. notifies subscribers when its value changes

That's it. All other features, like Immutability, data fetching, undo, etc. are implementation details.

Read more about the `general-store` rationale [on the HubSpot Product Team Blog](http://product.hubspot.com/blog/keeping-flux-flexible-with-general-store).

## Install

```bash
# npm >= 5.0.0
npm install general-store

# yarn
yarn add general-store
```

```js
// namespace import
import * as GeneralStore from 'general-store';
// or import just your module
import { define } from 'general-store';
```

## Create a store

GeneralStore uses functions to encapsulate private data.

```javascript
var dispatcher = new Flux.Dispatcher();
function defineUserStore() {
  // data is stored privately inside the store module's closure
  var users = {
    123: {
      id: 123,
      name: 'Mary',
    },
  };

  return (
    GeneralStore.define()
      .defineName('UserStore')
      // the store's getter should return the public subset of its data
      .defineGet(function() {
        return users;
      })
      // handle actions received from the dispatcher
      .defineResponseTo('USER_ADDED', function(user) {
        users[user.id] = user;
      })
      .defineResponseTo('USER_REMOVED', function(user) {
        delete users[user.id];
      })
      // after a store is "registered" its action handlers are bound
      // to the dispatcher
      .register(dispatcher)
  );
}
```

If you use a singleton pattern for stores, simply use the result of `register` from a module.

```javascript
import { Dispatcher } from 'flux';
import * as GeneralStore from 'general-store';

var dispatcher = new Dispatcher();
var users = {};

var UserStore = GeneralStore.define()
  .defineGet(function() {
    return users;
  })
  .register(dispatcher);

export default UserStore;
```

## Dispatch to the Store

Sending a message to your stores via the dispatcher is easy.

```javascript
dispatcher.dispatch({
  actionType: 'USER_ADDED', // required field
  data: {
    // optional field, passed to the store's response
    id: 12314,
    name: 'Colby Rabideau',
  },
});
```

## Store Factories

The classic singleton store API is great, but can be hard to test.
`defineFactory()` provides an composable alternative to `define()` that makes
testing easier and allows you to extend store behavior.

```javascript
var UserStoreFactory = GeneralStore.defineFactory()
  .defineName('UserStore')
  .defineGetInitialState(function() {
    return {};
  })
  .defineResponses({
    USER_ADDED: function(state, user) {
      state[user.id] = user;
      return state;
    },
    USER_REMOVED: function(state, user) {
      delete state[user.id];
      return state;
    },
  });
```

Like singletons, factories have a register method. Unlike singletons, that
register method can be called many times and will always return a **new
instance** of the store described by the factory, which is useful in unit tests.

```javascript
describe('UserStore', () => {
  var storeInstance;
  beforeEach(() => {
    // each test will have a clean store
    storeInstance = UserStoreFactory.register(dispatcher);
  });

  it('adds users', () => {
    var mockUser = { id: 1, name: 'Joe' };
    dispatcher.dispatch({ actionType: USER_ADDED, data: mockUser });
    expect(storeInstance.get()).toEqual({ 1: mockUser });
  });

  it('removes users', () => {
    var mockUser = { id: 1, name: 'Joe' };
    dispatcher.dispatch({ actionType: USER_ADDED, data: mockUser });
    dispatcher.dispatch({ actionType: USER_REMOVED, data: mockUser });
    expect(storeInstance.get()).toEqual({});
  });
});
```

To further assist with testing, the [`InspectStore`](https://github.com/HubSpot/general-store/blob/master/src/store/InspectStore.js) module allows you to read the internal fields of a store instance (e.g. `InspectStore.getState(store)`).

## Using the Store API

A registered Store provides methods for "getting" its value and subscribing to changes to that value.

```javascript
UserStore.get(); // returns {}
var subscription = UserStore.addOnChange(function() {
  // handle changes!
});
// addOnChange returns an object with a `remove` method.
// When you're ready to unsubscribe from a store's changes,
// simply call that method.
subscription.remove();
```

## React

GeneralStore provides some convenience functions for supplying data to React components. Both functions rely on the concept of "dependencies" and process those dependencies to return any data kept in a `Store` and make it easily accessible to a React component.

### Dependencies

GeneralStore has a two formats for declaring data dependencies of React components. A `SimpleDependency` is simply a reference to a `Store` instance. The value returned will be the result of `Store.get()`. A `CompoundDependency` depends on one or more stores and uses a "dereference" function that allows you to perform operations and data manipulation on the data that comes from the `stores` listed in the dependency:

```javascript
const FriendsDependency = {
  // compound fields can depend on one or more stores
  // and specify a function to "dereference" the store's value.
  stores: [ProfileStore, UsersStore],
  deref: props => {
    friendIds = ProfileStore.get().friendIds;
    users = UsersStore.get();
    return friendIds.map(id => users[id]);
  },
};
```

Once you declare your dependencies there are two ways to connect them to a react component.

### `useStoreDependency`

`useStoreDependency` is a [React Hook](https://reactjs.org/docs/hooks-intro.html) that enables you to connect to a single dependency inside of a functional component. The `useStoreDependency` hook accepts a dependency, and optionally a map of props to pass into the `deref` and a dispatcher instance.

```javascript
function FriendsList() {
  const friends = GeneralStore.useStoreDependency(
    FriendsDependency,
    {},
    dispatcher
  );
  return (
    <ul>
      {friends.map(friend => (
        <li>{friend.getName()}</li>
      ))}
    </ul>
  );
}
```

### `connect`

The second option is a Higher-Order Component (commonly "HOC") called `connect`. It's similar to `react-redux`'s `connect` function but it takes a `DependencyMap`. Note that this is different than `useStoreDependency` which only accepts a single `Dependency`, even though (as of v4) `connect` and `useStoreDependency` have the same implementation under the hood. A `DependencyMap` is a mapping of string keys to [`Dependency`s](#Dependencies):

```javascript
const dependencies = {
  // simple fields can be expressed in the form `key => store`
  subject: ProfileStore,
  friends: FriendsDependency,
};
```

`connect` passes the fields defined in the `DependencyMap` to the enhanced component as props.

```javascript
// ProfileContainer.js
function ProfileContainer({ friends, subject }) {
  return (
    <div>
      <h1>{subject.name}</h1>
      {this.renderFriends()}
      <h3>Friends</h3>
      <ul>
        {Object.keys(friends).map(id => (
          <li>{friends[id].name}</li>
        ))}
      </ul>
    </div>
  );
}

export default connect(
  dependencies,
  dispatcher
)(ProfileComponent);
```

`connect` also allows you to compose dependencies - the result of the entire dependency map is passed as the second argument to all `deref` functions. While the above syntax is simpler, if the Friends and Users data was a bit harder to calculate and each required multiple stores, the friends dependency could've been written as a composition like this:

```javascript
const dependencies = {
  users: UsersStore,
  friends: {
    stores: [ProfileStore],
    deref: (props, deps) => {
      friendIds = ProfileStore.get().friendIds;
      return friendIds.map(id => deps.users[id]);
    },
  },
};
```

This composition makes separating dependency code and making dependencies testable much easier, since all dependency logic doesn't need to be fully self-contained.

## Default Dispatcher Instance

The common Flux architecture has a single central dispatcher. As a convenience `GeneralStore` allows you to set a global dispatcher which will become the default when a store is registered, the `useStoreDependency` hook is called inside a functional component, or a component is enhanced with `connect`.

```javascript
var dispatcher = new Flux.Dispatcher();
GeneralStore.DispatcherInstance.set(dispatcher);
```

Now you can register a store without explicitly passing a dispatcher:

```javascript
const users = {};

const usersStore = GeneralStore.define()
  .defineGet(() => users)
  .register(); // the dispatcher instance is set so no need to explicitly pass it

function MyComponent() {
  // no need to pass it to "useStoreDependency" or "connect" either
  const users = GeneralStore.useStoreDependency(usersStore);
  /* ... */
}
```

## Dispatcher Interface

At HubSpot we use the [Facebook Dispatcher](https://github.com/facebook/flux), but any object that conforms to the same interface (i.e. has register and unregister methods) should work just fine.

```javascript
type DispatcherPayload = {
  actionType: string,
  data: any,
};

type Dispatcher = {
  isDispatching: () => boolean,
  register: (handleAction: (payload: DispatcherPayload) => void) => string,
  unregister: (dispatchToken: string) => void,
  waitFor: (dispatchTokens: Array<string>) => void,
};
```

## Redux Devtools Extension

Using [Redux devtools extension](https://github.com/zalmoxisus/redux-devtools-extension) you can inspect the state of a store and see how the state changes between dispatches. The "Jump" (ability to change store state to what it was after a specific dispatch) feature should work but it is dependent on you using regular JS objects as the backing state.

Using the `defineFactory` way of creating stores is highly recommended for this integration as you can define a name for your store and always for the state of the store to be inspected programmatically.

## Build and test

**Install Dependencies**

```
# pull in dependencies
yarn install

# run the type checker and unit tests
yarn test

# if all tests pass, run the dev and prod build
yarn run build-and-test

# if all tests pass, run the dev and prod build then commit and push changes
yarn run deploy
```

## Special Thanks

Logo design by [Chelsea Bathurst](http://www.chelseabathurst.com)
