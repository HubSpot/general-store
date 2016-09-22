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

```
# for node, browserify, etc
npm install general-store

# for bower
bower install general-store
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
      name: 'Mary'
    }
  };

  return GeneralStore.define()
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
    .register(dispatcher);
}
```

If you use a singleton pattern for stores, simply use the result of `register` from a module.

```javascript
var Dispatcher = require('flux').Dispatcher;
var GeneralStore = require('general-store.js');

var dispatcher = new Dispatcher();
var users = {};

var UserStore = GeneralStore.define()
  .defineGet(function() {
    return users;
  })
  .register(dispatcher);

module.exports = UserStore;
```

## Dispatch to the Store

Sending a message to your stores via the dispatcher is easy.

```javascript
dispatcher.dispatch({
  actionType: 'USER_ADDED', // required field
  data: { // optional field, passed to the store's response
    id: 12314,
    name: 'Colby Rabideau'
  }
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
    'USER_ADDED': function(state, user) {
      state[user.id] = user;
      return state;
    },
    'USER_REMOVED': function(state, user) {
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
    var mockUser = {id: 1, name: 'Joe'};
    dispatcher.dispatch({actionType: USER_ADDED, data: mockUser});
    expect(storeInstance.get()).toEqual({1: mockUser});
  });

  it('removes users', () => {
    var mockUser = {id: 1, name: 'Joe'};
    dispatcher.dispatch({actionType: USER_ADDED, data: mockUser});
    dispatcher.dispatch({actionType: USER_REMOVED, data: mockUser});
    expect(storeInstance.get()).toEqual({});
  });
});
```

To further assist with testing, the [`InspectStore`](https://github.com/HubSpot/general-store/blob/master/src/store/InspectStore.js) module allows you to read the internal fields of a store instance (e.g. `InspectStore.getState(store)`).

## Using the Store API

A registered Store provides methods for "getting" its value and subscribing to changes to that value.

```javascript
UserStore.get() // returns {}
var subscription = UserStore.addOnChange(function() {
  // handle changes!
});
// addOnChange returns an object with a `remove` method.
// When you're ready to unsubscribe from a store's changes,
// simply call that method.
subscription.remove();
```

## React

### DependencyMap

GeneralStore has a simple format for declaring dependencies.

```javascript
const dependencies = {
  // simple fields can be expressed in the form `key => store`
  subject: ProfileStore,
  // compound fields can depend on one or more stores
  // and specify a function to "dereference" the store's value
  friends: {
    stores: [ProfileStore, UsersStore],
    deref: (props, state) => {
      friendIds = ProfileStore.get().friendIds;
      users = UsersStore.get();
      return friendIds.map(id => users[id]);
    }
  }
};
```

Once you declare your dependencies there are two ways to connect them to a react component.

### connect

GeneralStore provides a component "enhancer" called `connect`.
It's similar to redux's `connect` function but it takes a general store DependencyMap.
`connect` passes the fields defined in the `DependencyMap` to the enhanced component as props.

```javascript
// ProfileContainer.js
function ProfileContainer({friends, subject}) {
  return (
    <div>
      <h1>{subject.name}</h1>
      {this.renderFriends()}
      <h3>Friends</h3>
      <ul>
        {Object.keys(friends).map(id => <li>{friends[id].name}</li>)}
      </ul>
    </div>
  );
}

export default connect(dependencies, dispatcher)(ProfileComponent);
```

### StoreDependencyMixin

If you use `React.createClass`, GeneralStore also provides a mixin.
Instead of passing the dependency fields to the component as props, `StoreDependencyMixin` exposes dependency data in component local state.

```javascript
var ProfileComponent = React.createClass({
  mixins: [
    GeneralStore.StoreDependencyMixin(dependencies, dispatcher)
  ],

  render: function() {
    return (
      <div>
        <h1>{this.state.subject.name}</h1>
        <h3>Friends</h3>
        <ul>
          {Object.keys(this.state.friends).map((id) => (
            <li>{friends[id].name}</li>
          ))}
        </ul>
      </div>
    );
  },
});
```

## Default Dispatcher Instance

The common Flux architecture has a single central dispatcher. As a convenience `GeneralStore` allows you to set a global dispatcher which will become the default when a store is registered, a component is enhanced with `connected`, or a `StoreDependencyMixin` is created.

```javascript
var dispatcher = new Flux.Dispatcher();
GeneralStore.DispatcherInstance.set(dispatcher);
```

Now you can register a store without explicitly passing a dispatcher:

```javascript
var users = {};

GeneralStore.define()
  .defineGet(() => users)
  .register(); // the dispatcher instance is set so no need to explicitly pass it
```

## Dispatcher Interface

At HubSpot we use the [Facebook Dispatcher](https://github.com/facebook/flux), but any object that conforms to the same interface (i.e. has register and unregister methods) should work just fine.

```javascript
type DispatcherPayload = {
  actionType: string;
  data: any;
};

type Dispatcher = {
  isDispatching: () => bool;
  register: (
    handleAction: (payload: DispatcherPayload) => void
  ) => string;
  unregister: (dispatchToken: string) => void;
  waitFor: (dispatchTokens: Array<string>) => void;
};
```

## Build and test

**Install Dependencies**

```
# pull in dependencies
npm install

# run the type checker and unit tests
npm test

# if all tests pass, run the dev and prod build
npm run build-and-test

# if all tests pass, run the dev and prod build then commit and push changes
npm run deploy
```

## Special Thanks

Logo design by [Chelsea Bathurst](http://www.chelseabathurst.com)
