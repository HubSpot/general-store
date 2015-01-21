# HubSpot Store (for Flux)

```javascript
define('UsersStore', [
  'dispatcher',
  'hs-store.js'
], function(
  Dispatcher,
  HSStore
) {

  // data is stored privately inside the store module's closure
  var users = {
    123: {
      id: 123,
      name: 'Mary'
    }
  };

  var UsersStore = HSStore.define()
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
    .register();

    return UsersStore;
});
```

## HSStore and React

HSStore provides a convenient mixin for binding stores to React components:

```
define('UsersComponent', [
  'hs-store',
  'React',
  'UsersStore'
], function(
  HSStore
  React,
  UsersStore
) {

  var UsersComponent = React.createClass({

    // the component will re-render each time one of these stores
    // triggers its change listeners
    stores: [
      UsersStore
    ],

    getStoreState: function() {
      return {
        users: UsersStore.get()
      };
    },

    render: function() {
      return (
        <ul>
          {this.state.users.map(this.renderUser)}
        </ul>
      );
    },

    renderUser: function(user) {
      return (
        <li>
          {user.name}
        </li>
      );
    }
  });

  return UsersComponent;
});

## Dispatcher Interface

At HubSpot we use the [Facebook Dispatcher](https://github.com/facebook/flux), but any object that conforms to the following interface should work just fine.

```
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
