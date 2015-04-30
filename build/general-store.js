!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.GeneralStore=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/* @flow */

'use strict';

var StoreDefinition = _dereq_('./store/StoreDefinition.js');

var GeneralStore = {

  define: function define() {
    return new StoreDefinition();
  },

  DispatcherInstance: _dereq_('./dispatcher/DispatcherInstance.js'),

  StoreDependencyMixin: _dereq_('./mixin/StoreDependencyMixin.js')

};

module.exports = GeneralStore;

},{"./dispatcher/DispatcherInstance.js":2,"./mixin/StoreDependencyMixin.js":7,"./store/StoreDefinition.js":13}],2:[function(_dereq_,module,exports){
/**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * @flow
 **/

'use strict';

var DispatcherInterface = _dereq_('./DispatcherInterface.js');

var invariant = _dereq_('../invariant.js');

var instance = null;

var DispatcherInstance = {

  get: function get() {
    return instance;
  },

  set: function set(dispatcher) {
    invariant(DispatcherInterface.isDispatcher(dispatcher), 'DispatcherInstance.set: Expected dispatcher to be an object' + ' with a register method, and an unregister method but got "%s".' + ' Learn more about the dispatcher interface:' + ' https://github.com/HubSpot/general-store#dispatcher-interface', dispatcher);
    instance = dispatcher;
  }

};

module.exports = DispatcherInstance;

},{"../invariant.js":6,"./DispatcherInterface.js":3}],3:[function(_dereq_,module,exports){
/**
 * @flow
 */

'use strict';

var DispatcherInterface = {

  isDispatcher: function isDispatcher(dispatcher) {
    return typeof dispatcher === 'object' && typeof dispatcher.register === 'function' && typeof dispatcher.unregister === 'function';
  },

  isPayload: function isPayload(payload) {
    return payload !== null && typeof payload === 'object' && typeof payload.actionType === 'string';
  }

};

module.exports = DispatcherInterface;

},{}],4:[function(_dereq_,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/**
 * @flow
 */

var EventHandler = _dereq_('./EventHandler.js');

var uniqueID = _dereq_('../uniqueid/uniqueID.js');

var Event = (function () {
  function Event() {
    _classCallCheck(this, Event);

    this._handlers = undefined;

    this._handlers = {};
  }

  _createClass(Event, [{
    key: 'addHandler',

    /**
     * Add a subscription to this event
     *
     * @param  callback  run when the event is triggered.
     * @return this
     */
    value: function addHandler(callback) {
      var key = uniqueID();
      this._handlers[key] = callback;
      return new EventHandler(this, key);
    }
  }, {
    key: 'remove',

    /**
     * Destroys this event. Removes all handlers.
     *
     * @return this
     */
    value: function remove() {
      this._handlers = {};
      return this;
    }
  }, {
    key: 'removeHandler',

    /**
     * Removes a subscription by key.
     *
     * @param  key   id of the subscription to remove
     * @return this
     */
    value: function removeHandler(key) {
      delete this._handlers[key];
      return this;
    }
  }, {
    key: '_runHandler',

    /**
     * @protected
     * Run a handler by key if it exists
     *
     * @param  key  id of the handler to run
     */
    value: function _runHandler(key) {
      if (this._handlers.hasOwnProperty(key)) {
        this._handlers[key].call();
      }
    }
  }, {
    key: 'runHandlers',

    /**
     * Run all subscribed handlers.
     *
     * @return this
     */
    value: function runHandlers() {
      Object.keys(this._handlers).forEach(this._runHandler.bind(this));
      return this;
    }
  }]);

  return Event;
})();

/**
 * Convenience method for running multiple events.
 *
 * @param  events  a list of events to run.
 */
Event.runMultiple = function (events) {
  events.forEach(function (evt) {
    return evt.runHandlers();
  });
};

module.exports = Event;

},{"../uniqueid/uniqueID.js":15,"./EventHandler.js":5}],5:[function(_dereq_,module,exports){
"use strict";

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var EventHandler = (function () {
  function EventHandler(instance, key) {
    _classCallCheck(this, EventHandler);

    this._key = undefined;
    this._instance = undefined;

    this._key = key;
    this._instance = instance;
  }

  _createClass(EventHandler, [{
    key: "remove",
    value: function remove() {
      if (this._instance === null || this._instance === undefined) {
        return;
      }
      this._instance.removeHandler(this._key);
      this._instance = null;
    }
  }]);

  return EventHandler;
})();

module.exports = EventHandler;
/**
 * @flow
 */

},{}],6:[function(_dereq_,module,exports){
/* eslint max-len:0 */

/**
 * BSD License
 *
 * For Flux software
 *
 * Copyright (c) 2014, Facebook, Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification,
 * are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 *  * Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *
 *  * Neither the name Facebook nor the names of its contributors may be used to
 *    endorse or promote products derived from this software without specific
 *    prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @flow
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function invariant(condition, format, a, b, c, d, e, f) {
  if ("development" !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if ("development" !== 'production') {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error('Invariant Violation: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
    } else {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    }
    throw error;
  }
};

module.exports = invariant;

},{}],7:[function(_dereq_,module,exports){
/**
 * @flow
 */

'use strict';

var StoreFacade = _dereq_('../store/StoreFacade.js');

var _require = _dereq_('./StoreDependencyMixinFields.js');

var dependencies = _require.dependencies;
var stores = _require.stores;

var _require2 = _dereq_('./StoreDependencyMixinHandlers.js');

var cleanupHandlers = _require2.cleanupHandlers;
var setupHandlers = _require2.setupHandlers;

var _require3 = _dereq_('./StoreDependencyMixinInitialize.js');

var applyDependencies = _require3.applyDependencies;

var _require4 = _dereq_('./StoreDependencyMixinState.js');

var getDependencyState = _require4.getDependencyState;

var _require5 = _dereq_('./StoreDependencyMixinTransitions.js');

var hasPropsChanged = _require5.hasPropsChanged;
var hasStateChanged = _require5.hasStateChanged;

function StoreDependencyMixin(dependencyMap) {
  var fieldNames = Object.keys(dependencyMap);
  var isFirstMixin = false;

  return {
    componentWillMount: function componentWillMount() {
      if (!isFirstMixin) {
        return;
      }
      setupHandlers(this);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      if (!isFirstMixin || !hasPropsChanged(this.props, nextProps)) {
        return;
      }
      this.setState(getDependencyState(this, nextProps, this.state, null));
    },

    componentWillUnmount: function componentWillUnmount() {
      if (!isFirstMixin) {
        return;
      }
      cleanupHandlers(this);
    },

    componentDidUpdate: function componentDidUpdate(oldProps, oldState) {
      if (!isFirstMixin || !hasStateChanged(dependencies(this), oldState, this.state)) {
        return;
      }
      this.setState(getDependencyState(this, this.props, this.state, null));
    },

    getInitialState: function getInitialState() {
      isFirstMixin = !stores(this).length;
      applyDependencies(this, dependencyMap);
      return getDependencyState(this, this.props, this.state, Object.keys(dependencyMap));
    }
  };
}

module.exports = StoreDependencyMixin;

},{"../store/StoreFacade.js":14,"./StoreDependencyMixinFields.js":8,"./StoreDependencyMixinHandlers.js":9,"./StoreDependencyMixinInitialize.js":10,"./StoreDependencyMixinState.js":11,"./StoreDependencyMixinTransitions.js":12}],8:[function(_dereq_,module,exports){
/**
 * @flow
 */

'use strict';

var EventHandler = _dereq_('../event/EventHandler.js');
var StoreFacade = _dereq_('../store/StoreFacade.js');

var DEPENDENCIES_KEY = '__StoreDependencyMixin-dependencies';
var HANDLERS_KEY = '__StoreDependencyMixin-eventHandlers';
var QUEUE_KEY = '__StoreDependencyMixin-queue';
var STORES_KEY = '__StoreDependencyMixin-stores';
var STORE_FIELDS_KEY = '__StoreDependencyMixin-storeFields';

function getKey(key, identity, component) {
  if (!component.hasOwnProperty(key)) {
    component[key] = identity;
  }
  return component[key];
}

var StoreDependencyMixinFields = {
  dependencies: function dependencies(component) {
    return getKey(DEPENDENCIES_KEY, {}, component);
  },

  handlers: function handlers(component) {
    return getKey(HANDLERS_KEY, [], component);
  },

  queue: function queue(component) {
    return getKey(QUEUE_KEY, {}, component);
  },

  stores: function stores(component) {
    return getKey(STORES_KEY, [], component);
  },

  storeFields: function storeFields(component) {
    return getKey(STORE_FIELDS_KEY, {}, component);
  }
};

module.exports = StoreDependencyMixinFields;

},{"../event/EventHandler.js":5,"../store/StoreFacade.js":14}],9:[function(_dereq_,module,exports){
/**
 * @flow
 */

'use strict';

var _require = _dereq_('./StoreDependencyMixinFields.js');

var dependencies = _require.dependencies;
var handlers = _require.handlers;
var queue = _require.queue;
var storeFields = _require.storeFields;
var stores = _require.stores;

function flushQueue(component) {
  var componentDependencies = dependencies(component);
  var componentQueue = queue(component);
  var stateUpdate = {};
  Object.keys(componentQueue).forEach(function (field) {
    var fieldDef = componentDependencies[field];
    stateUpdate[field] = fieldDef.deref(component.props, component.state, fieldDef.stores);
    delete componentQueue[field];
  });
  component.setState(stateUpdate);
}

function waitForOtherStores(component, currentStoreId) {
  var componentStores = stores(component);
  componentStores.forEach(function (store) {
    var dispatcher = store.getDispatcher();
    if (store.getID() === currentStoreId || !dispatcher.isDispatching()) {
      return;
    }
    dispatcher.waitFor([store.getDispatchToken()]);
  });
}

function handleStoreChange(component, storeId) {
  var componentQueue = queue(component);
  var queueWasEmpty = Object.keys(componentQueue).length === 0;
  storeFields(component)[storeId].forEach(function (field) {
    if (componentQueue.hasOwnProperty(field)) {
      return;
    }
    componentQueue[field] = true;
  });
  // if there we already fields in the queue, this isn't the first store to
  // respond to the action so bail out
  if (!queueWasEmpty) {
    return;
  }
  // waitFor all other stores this component depends on to ensure we dont
  // run an extra setState if another store responds to the same action
  waitForOtherStores(component, storeId);
  flushQueue(component);
}

var StoreDependencyMixinHandlers = {
  cleanupHandlers: function cleanupHandlers(component) {
    var componentHandlers = handlers(component);
    while (componentHandlers.length) {
      componentHandlers.pop().remove();
    }
  },

  setupHandlers: function setupHandlers(component) {
    var componentHandlers = handlers(component);
    var componentStores = stores(component);
    componentStores.forEach(function (store) {
      componentHandlers.push(store.addOnChange(handleStoreChange.bind(null, component, store.getID())));
    });
  }
};

module.exports = StoreDependencyMixinHandlers;

},{"./StoreDependencyMixinFields.js":8}],10:[function(_dereq_,module,exports){
/**
 * @flow
 */

'use strict';

var StoreFacade = _dereq_('../store/StoreFacade.js');

var invariant = _dereq_('../invariant.js');

var _require = _dereq_('./StoreDependencyMixinFields.js');

var dependencies = _require.dependencies;
var storeFields = _require.storeFields;
var stores = _require.stores;

function defaultDeref(props, state, storeInstances) {
  return storeInstances[0].get();
}

var StoreDependencyMixinInitialize = {
  applyDependencies: function applyDependencies(component, dependencyMap) {
    var componentDependencies = dependencies(component);
    var componentStoreFields = storeFields(component);
    var componentStores = stores(component);
    Object.keys(dependencyMap).forEach(function (field) {
      var dependency = dependencyMap[field];
      var dependencyStores;
      if (dependency instanceof StoreFacade) {
        dependencyStores = [dependency];
        invariant(!componentDependencies.hasOwnProperty(field), 'StoreDependencyMixin: field "%s" is already defined', field);
        componentDependencies[field] = {
          deref: defaultDeref,
          stores: dependencyStores
        };
      } else {
        dependencyStores = dependency.stores;
        componentDependencies[field] = dependency;
      }
      // update the store-to-field map
      dependencyStores.forEach(function (store) {
        var storeId = store.getID();
        if (!componentStoreFields.hasOwnProperty(storeId)) {
          componentStoreFields[storeId] = [];
          // if we haven't seen this store bind a change handler
          componentStores.push(store);
        }
        componentStoreFields[storeId].push(field);
      });
    });
  }
};

module.exports = StoreDependencyMixinInitialize;

},{"../invariant.js":6,"../store/StoreFacade.js":14,"./StoreDependencyMixinFields.js":8}],11:[function(_dereq_,module,exports){
/**
 * @flow
 */

'use strict';

var _require = _dereq_('./StoreDependencyMixinFields.js');

var dependencies = _require.dependencies;

var StoreDependencyMixinState = {
  getDependencyState: function getDependencyState(component, props, state, fieldNames) {
    var componentDependencies = dependencies(component);
    fieldNames = fieldNames || Object.keys(componentDependencies);
    var dependencyState = {};
    fieldNames.forEach(function (field) {
      var _componentDependencies$field = componentDependencies[field];
      var deref = _componentDependencies$field.deref;
      var stores = _componentDependencies$field.stores;

      dependencyState[field] = deref(props, state, stores);
    });
    return dependencyState;
  }
};

module.exports = StoreDependencyMixinState;

},{"./StoreDependencyMixinFields.js":8}],12:[function(_dereq_,module,exports){
/**
 * @flow
 */

'use strict';

var compare = window.Immutable && typeof window.Immutable.is === 'function' ? window.Immutable.is : function (a, b) {
  return a === b;
};

function compareKey(key, objA, objB) {
  return compare(objA[key], objB[key]);
}

function shallowEqual(is, objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) && (!objB.hasOwnProperty(key) || !is(key, objA, objB))) {
      return false;
    }
  }
  // Test for B's keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

var StoreDependencyMixinTransitions = {
  hasPropsChanged: function hasPropsChanged(oldProps, nextProps) {
    return !shallowEqual(compareKey, oldProps, nextProps);
  },

  hasStateChanged: function hasStateChanged(stores, oldState, nextState) {
    return !shallowEqual(function (key, objA, objB) {
      return stores.hasOwnProperty(key) || // if the value is a store, ignore it
      compare(objA[key], objB[key]);
    }, oldState, nextState);
  }
};

module.exports = StoreDependencyMixinTransitions;

},{}],13:[function(_dereq_,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/* @flow */

var DispatcherInstance = _dereq_('../dispatcher/DispatcherInstance.js');
var DispatcherInterface = _dereq_('../dispatcher/DispatcherInterface.js');
var StoreFacade = _dereq_('./StoreFacade.js');

var invariant = _dereq_('../invariant.js');

function emptyGetter() {
  return null;
}

var HINT_LINK = 'Learn more about defining stores:' + ' https://github.com/HubSpot/general-store#create-a-store';

var StoreDefinition = (function () {
  function StoreDefinition() {
    _classCallCheck(this, StoreDefinition);

    this._facade = undefined;
    this._getter = undefined;
    this._responses = undefined;

    this._facade = null;
    this._getter = null;
    this._responses = {};
  }

  _createClass(StoreDefinition, [{
    key: 'defineGet',
    value: function defineGet(getter) {
      invariant(!this.isRegistered(), 'StoreDefinition.defineGet: this store definition cannot be modified' + ' because is has already been registered with a dispatcher. %s', HINT_LINK);
      invariant(typeof getter === 'function', 'StoreDefinition.defineGet: expected getter to be a function but got' + ' "%s" instead. %s', getter, HINT_LINK);
      this._getter = getter;
      return this;
    }
  }, {
    key: 'defineResponseTo',
    value: function defineResponseTo(actionTypes, response) {
      var _this = this;

      invariant(!this.isRegistered(), 'StoreDefinition.defineResponseTo: this store definition cannot be' + ' modified because is has already been registered with a dispatcher. %s', HINT_LINK);
      [].concat(actionTypes).forEach(function (actionType) {
        return _this._setResponse(actionType, response);
      });
      return this;
    }
  }, {
    key: 'isRegistered',
    value: function isRegistered() {
      return this._facade instanceof StoreFacade;
    }
  }, {
    key: 'register',
    value: function register(dispatcher) {
      dispatcher = dispatcher || DispatcherInstance.get();
      invariant(typeof dispatcher === 'object', 'StoreDefinition.register: you haven\'t provide a dispatcher instance.' + ' You can pass an instance to' + ' GeneralStore.define().register(dispatcher) or use' + ' GeneralStore.DispatcherInstance.set(dispatcher) to set a global' + ' instance.' + ' https://github.com/HubSpot/general-store#default-dispatcher-instance');
      invariant(DispatcherInterface.isDispatcher(dispatcher), 'StoreDefinition.register: Expected dispatcher to be an object' + ' with a register method, and an unregister method but got "%s".' + ' Learn more about the dispatcher interface:' + ' https://github.com/HubSpot/general-store#dispatcher-interface', dispatcher);
      invariant(typeof this._getter === 'function', 'StoreDefinition.register: a store cannot be registered without a' + ' getter. Use GeneralStore.define().defineGet(getter) to define a' + ' getter. %s', HINT_LINK);
      var facade = this._facade || new StoreFacade(this._getter || emptyGetter, this._responses, dispatcher);
      if (this._facade === null) {
        this._facade = facade;
      }
      return facade;
    }
  }, {
    key: '_setResponse',
    value: function _setResponse(actionType, response) {
      invariant(typeof actionType === 'string', 'StoreDefinition.defineResponseTo: expected actionType to be a string' + ' but got "%s" instead. %s', actionType, HINT_LINK);
      invariant(!this._responses.hasOwnProperty(actionType), 'StoreDefinition.defineResponseTo: conflicting resposes for actionType' + ' "%s". Only one response can be defined per actionType per Store. %s', actionType, HINT_LINK);
      invariant(typeof response === 'function', 'StoreDefinition.defineResponseTo: expected response to be a function' + ' but got "%s" instead. %s', response);
      this._responses[actionType] = response;
    }
  }]);

  return StoreDefinition;
})();

module.exports = StoreDefinition;

},{"../dispatcher/DispatcherInstance.js":2,"../dispatcher/DispatcherInterface.js":3,"../invariant.js":6,"./StoreFacade.js":14}],14:[function(_dereq_,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

/* eslint no-console:0 */
/* @flow */

var DispatcherInterface = _dereq_('../dispatcher/DispatcherInterface.js');
var Event = _dereq_('../event/Event.js');
var EventHandler = _dereq_('../event/EventHandler.js');

var uniqueID = _dereq_('../uniqueid/uniqueID.js');
var invariant = _dereq_('../invariant.js');

var HINT_LINK = 'Learn more about using the Store API:' + ' https://github.com/HubSpot/general-store#using-the-store-api';

function getNull() {
  return null;
}

var StoreFacade = (function () {
  function StoreFacade(getter, responses, dispatcher) {
    _classCallCheck(this, StoreFacade);

    this._dispatcher = undefined;
    this._dispatchToken = undefined;
    this._getter = undefined;
    this._event = undefined;
    this._responses = undefined;
    this._uid = undefined;

    this._dispatcher = dispatcher;
    this._getter = getter;
    this._responses = responses;
    this._event = new Event();
    this._uid = uniqueID();

    this._dispatchToken = this._dispatcher.register(this._handleDispatch.bind(this));
  }

  _createClass(StoreFacade, [{
    key: 'addOnChange',

    /**
     * Subscribe to changes on this store.
     *
     * @param  callback  will run every time the store responds to a dispatcher
     * @return this
     */
    value: function addOnChange(callback) {
      invariant(typeof callback === 'function', 'StoreFacade.addOnChange: expected callback to be a function' + ' but got "%s" instead. %s', callback, HINT_LINK);
      return this._event.addHandler(callback);
    }
  }, {
    key: 'get',

    /**
     * Returns the store's referenced value
     *
     * @param  ...  accepts any number of params
     * @return any
     */
    value: function get() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this._getter.apply(null, args);
    }
  }, {
    key: 'getDispatcher',

    /**
     * Exposes the store's dispatcher instance.
     *
     * @return Dispatcher
     */
    value: function getDispatcher() {
      return this._dispatcher;
    }
  }, {
    key: 'getDispatchToken',

    /**
     * Exposes the token assigned to the store by the dispatcher
     *
     * @return number
     */
    value: function getDispatchToken() {
      return this._dispatchToken;
    }
  }, {
    key: 'getID',
    value: function getID() {
      return this._uid;
    }
  }, {
    key: '_handleDispatch',

    /**
     * @protected
     * Responds to incoming messages from the Dispatcher
     */
    value: function _handleDispatch(payload) {
      if ("development" !== 'production') {
        invariant(DispatcherInterface.isPayload(payload), 'StoreFacade: expected dispatched payload to be an object with a' + ' property "actionType" containing a string and an optional property' + ' "data" containing any value but got "%s" instead. Learn more about' + ' the dispatcher interface:' + ' https://github.com/HubSpot/general-store#dispatcher-interface');
      }
      if (!this._responses.hasOwnProperty(payload.actionType)) {
        return;
      }
      this._responses[payload.actionType](payload.data, payload.actionType, payload);
      this.triggerChange();
    }
  }, {
    key: 'remove',

    /**
     * Destroys this instance of the store.
     * Dispatch callback is unregistered. Subscriptions are removed.
     */
    value: function remove() {
      this._dispatcher.unregister(this.getDispatchToken());
      this._event.remove();
      this._getter = getNull;
      this._responses = {};
    }
  }, {
    key: 'triggerChange',

    /**
     * Runs all of the store's subscription callbacks
     *
     * @return this
     */
    value: function triggerChange() {
      if ("development" !== 'production') {
        if (!this._dispatcher.isDispatching()) {
          console.warn('StoreFacade: you called store.triggerChange() outside of a' + ' dispatch loop. Send an action trough the dispatcher to' + ' avoid potentailly confusing behavior.');
        }
      }
      this._event.runHandlers();
      return this;
    }
  }]);

  return StoreFacade;
})();

module.exports = StoreFacade;

},{"../dispatcher/DispatcherInterface.js":3,"../event/Event.js":4,"../event/EventHandler.js":5,"../invariant.js":6,"../uniqueid/uniqueID.js":15}],15:[function(_dereq_,module,exports){
/**
 * @flow
 */

"use strict";

var nextUid = 0;
function uid() {
  return nextUid++;
}

module.exports = uid;

},{}]},{},[1])(1)
});