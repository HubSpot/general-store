# GeneralStore (for Flux)

It's descriptive *and* punny!

![general-store](https://git.hubteam.com/github-enterprise-assets/0000/0376/0000/7618/b4cf46ea-a7cb-11e4-86f3-fe5c5c53d10e.jpg)

### TODOs

- [x] make `StoreListenerMixin` simpler (e.g. lets not have `getStoreState` and the `stores` array)
- [ ] clean up the runtime type checks (easier to read + maintain the same execution flow in the minified build)
- [ ] readme and/or other docs

GeneralStore aims to get at the essence of a Flux store without falling into an overly prescriptive data model. A store is a observable reference to a value, with an explicit set of mutations that are triggered by messages from an event emitter.

In other words a store:

1. encapsulates an arbitrary value
2. exposes that value to subscribers via a get method
3. changes that value in response to certain events from the Dispatcher
4. notifies subscribers when that value changes

Other features, like Immutability, data fetching, undo, etc., should be implementation details of their individual stores. We also didn’t want to write switch statements anymore… JavaScript switch statements are terrifying.

# Create a store

GeneralStore uses functions to encapsulate private data.

```javascript
function defineUserStore() {
  // data is stored privately inside the store module's closure
  var users = {
    123: {
      id: 123,
      name: 'Mary'
    }
  };

  return GeneralStore.define()
    // the stores getter should return the public subset of the store's data
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
    // after a store is "registered" it's action handlers are bound
    // to the dispatcher
    .register(dispatcher);
}
```

If you use a singleton pattern for stores, simply the result of `register` from a module.

```javascript
var Dispatcher = require('dispatcher');
var GeneralStore = require('general-store.js');

var users = {};

var UserStore = GeneralStore.define()
  .defineGet(function() {
    return users;
  })
  .register(dispatcher);

module.exports = UserStore;
```


## React

GeneralStore provides a convenient mixin for binding stores to React components:

```javascript
var UsersComponent = React.createClass({
  mixins: [
    GeneralStore.StoreDependencyMixin({
      users: UserStore
    })
  ],

  render: function() {
    var users = this.state.users;
    return (
      <ul>
        {Object.keys(users).map(id => <li>{users[id].name}</li>)}
      </ul>
    );
  }
});
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
npm install
brew install flow
```

**Run the build**
```
# if all tests pass, runs the dev and prod build
npm run build-and-test
# if all tests pass, runs the dev and prod build, commits and changes
npm run deploy
```
