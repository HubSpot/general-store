# HubSpot Store

```javascript
define('AwesomeStore', [
  'dispatcher'
  'hs-store.js'
], function(Dispatcher, HSStore) {

  // data is stored privately inside the store module's closure
  var awesomeStoreData = {
    everythingIsAwesome: true
  };

  var AwesomeStore = HSStore.define()
    // the stores getter should return the public subset of the store's data
    .defineGet(function() {
      return everythingIsAwesome;
    })
    // handle actions received from the dispatcher
    .defineResponseTo('SOMETHING_BAD_HAPPENED', function() {
      awesomeStoreData.everythingIsAwesome = false;
    })
    .defineResponseTo('SOMETHING_GREAT_HAPPENED', function() {
      awesomeStoreData.everythingIsAwesome = true;
    })
    // after a store is "registered" it's action handlers are bound
    // to the dispatcher
    .register(Dispatcher);

});
```

