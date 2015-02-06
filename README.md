# GeneralStore (for Flux) [![Build Status](https://travis-ci.org/HubSpot/general-store.svg)](https://travis-ci.org/HubSpot/general-store)


![general-store](https://git.hubteam.com/github-enterprise-assets/0000/0376/0000/7618/b4cf46ea-a7cb-11e4-86f3-fe5c5c53d10e.jpg)

**This is alpha software. It's going to change.**

GeneralStore aims to get at the essence of a [Flux](http://facebook.github.io/flux/) store without falling into an overly prescriptive data model. A store is an observable reference to a value, with an explicit set of mutations that are triggered by messages from an event emitter.

In other words a store:

1. encapsulates a value (of *any kind*)
2. allows subscribers to read its value
3. updates its value in response to specific messages from the Dispatcher
4. notifies subscribers when its value changes

Other features, like immutability, data fetching, undo, etc., should be implementation details of their individual stores. We also didn’t want to write switch statements anymore… JavaScript switch statements are terrifying.

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
    // the store's getter should return the public subset of its data
    .defineGet(function() {
      return users;
    })
    // handle actions received from the dispatcher
    .defineResponseTo('ADD_USER', function(user) {
      users[user.id] = user;
    })
    .defineResponseTo('REMOVE_USER', function(user) {
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

## Using the Store API

A registered Store provides methods for "getting" its value and subscribing to changes to that value.

```javascript
UserStore.get() // returns {}
var subscription = UserStore.addOnChange(function() {
  // handle changes!
});
// addOnChange returns an object with a `remove` method.
// When you're ready to unsuscribe from a store's changes,
// simply call that method.
subscription.remove();
```

## React

GeneralStore provides a convenient mixin for binding stores to React components:

```javascript
var ProfileComponent = React.createClass({
  mixins: [
    GeneralStore.StoreDependencyMixin({
      // simple fields can be expression in the for `key => store`
      subject: ProfileStore,
      // compound fields can depend on one or more stores
      // and/or specify a function to "dereference" the store's value
      friends: {
        stores: [ProfileStore, UsersStore],
        deref: (props, state) => {
          friendIds = ProfileStore.get().friendIds;
          users = UsersStore.get();
          return friendIds.map(id => users[id]);
        }
      }
    })
  ],

  render: function() {
    var users = this.state.users;
    return (
      <div>
        <h1>{this.state.subject.name}</h1>
        {this.renderFriends()}
      </div>
    );
  },

  renderFriends: function() {
    var friends = this.state.friends;
    return (
      <div>
        <h3>Friends</h3>
        <ul>
          {Object.keys(friends).map(id => <li>{friends[id].name}</li>)}
        </ul>
      </div>
    );
  }
});
```

## Default Dispatcher Instance

The common Flux architecture has a single centeral dispatcher. As a convenice `GeneralStore` allows you to set a global dispatcher which will become the default when a store is registered.

```javascript
var dispatcher = new Flux.Dispatcher();
GeneralStore.DispatcherInstance.set(dispatcher);
```

Now you can register a store without explicity passing a dispatcher:

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
  register: (
    handleAction: (payload: DispatcherPayload) => void
  ) => number;
  unregister: (dispatchToken: number) => void;
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

