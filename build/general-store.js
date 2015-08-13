!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.GeneralStore=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.define = define;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _storeStoreDefinitionJs = _dereq_('./store/StoreDefinition.js');

var _storeStoreDefinitionJs2 = _interopRequireDefault(_storeStoreDefinitionJs);

var _dispatcherDispatcherInstanceJs = _dereq_('./dispatcher/DispatcherInstance.js');

var _dispatcherDispatcherInstanceJs2 = _interopRequireDefault(_dispatcherDispatcherInstanceJs);

var _mixinStoreDependencyMixinJs = _dereq_('./mixin/StoreDependencyMixin.js');

var _mixinStoreDependencyMixinJs2 = _interopRequireDefault(_mixinStoreDependencyMixinJs);

function define() {
  return new _storeStoreDefinitionJs2['default']();
}

var DispatcherInstance = _dispatcherDispatcherInstanceJs2['default'];
exports.DispatcherInstance = DispatcherInstance;
var StoreDependencyMixin = _mixinStoreDependencyMixinJs2['default'];
exports.StoreDependencyMixin = StoreDependencyMixin;

},{"./dispatcher/DispatcherInstance.js":2,"./mixin/StoreDependencyMixin.js":7,"./store/StoreDefinition.js":13}],2:[function(_dereq_,module,exports){
/**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * 
 **/

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _DispatcherInterfaceJs = _dereq_('./DispatcherInterface.js');

var _invariantJs = _dereq_('../invariant.js');

var _invariantJs2 = _interopRequireDefault(_invariantJs);

var instance = null;

var DispatcherInstance = {
  get: function get() {
    return instance;
  },

  set: function set(dispatcher) {
    (0, _invariantJs2['default'])((0, _DispatcherInterfaceJs.isDispatcher)(dispatcher), 'DispatcherInstance.set: Expected dispatcher to be an object' + ' with a register method, and an unregister method but got "%s".' + ' Learn more about the dispatcher interface:' + ' https://github.com/HubSpot/general-store#dispatcher-interface', dispatcher);
    instance = dispatcher;
  }
};

exports['default'] = DispatcherInstance;
module.exports = exports['default'];

},{"../invariant.js":6,"./DispatcherInterface.js":3}],3:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.isDispatcher = isDispatcher;
exports.isPayload = isPayload;

function isDispatcher(dispatcher) {
  return typeof dispatcher === 'object' && typeof dispatcher.register === 'function' && typeof dispatcher.unregister === 'function';
}

function isPayload(payload) {
  return payload !== null && typeof payload === 'object' && typeof payload.actionType === 'string';
}

},{}],4:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _EventHandlerJs = _dereq_('./EventHandler.js');

var _EventHandlerJs2 = _interopRequireDefault(_EventHandlerJs);

var _uniqueidUniqueIDJs = _dereq_('../uniqueid/uniqueID.js');

var _uniqueidUniqueIDJs2 = _interopRequireDefault(_uniqueidUniqueIDJs);

var Event = (function () {
  function Event() {
    _classCallCheck(this, Event);

    this._handlers = {};
  }

  /**
   * Add a subscription to this event
   *
   * @param  callback  run when the event is triggered.
   * @return this
   */

  _createClass(Event, [{
    key: 'addHandler',
    value: function addHandler(callback) {
      var key = (0, _uniqueidUniqueIDJs2['default'])();
      this._handlers[key] = callback;
      return new _EventHandlerJs2['default'](this, key);
    }

    /**
     * Destroys this event. Removes all handlers.
     *
     * @return this
     */
  }, {
    key: 'remove',
    value: function remove() {
      this._handlers = {};
      return this;
    }

    /**
     * Removes a subscription by key.
     *
     * @param  key   id of the subscription to remove
     * @return this
     */
  }, {
    key: 'removeHandler',
    value: function removeHandler(key) {
      delete this._handlers[key];
      return this;
    }

    /**
     * @protected
     * Run a handler by key if it exists
     *
     * @param  key  id of the handler to run
     */
  }, {
    key: '_runHandler',
    value: function _runHandler(key) {
      if (this._handlers.hasOwnProperty(key)) {
        this._handlers[key].call();
      }
    }

    /**
     * Run all subscribed handlers.
     *
     * @return this
     */
  }, {
    key: 'runHandlers',
    value: function runHandlers() {
      Object.keys(this._handlers).forEach(this._runHandler.bind(this));
      return this;
    }

    /**
     * Convenience method for running multiple events.
     *
     * @param  events  a list of events to run.
     */
  }], [{
    key: 'runMultiple',
    value: function runMultiple(events) {
      events.forEach(function (evt) {
        return evt.runHandlers();
      });
    }
  }]);

  return Event;
})();

exports['default'] = Event;
module.exports = exports['default'];

},{"../uniqueid/uniqueID.js":15,"./EventHandler.js":5}],5:[function(_dereq_,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EventHandler = (function () {
  function EventHandler(instance, key) {
    _classCallCheck(this, EventHandler);

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

exports["default"] = EventHandler;
module.exports = exports["default"];

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
 * 
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

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = invariant;

function invariant(condition, format, a, b, c, d, e, f) {
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
}

module.exports = exports['default'];

},{}],7:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = StoreDependencyMixin;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _storeStoreFacadeJs = _dereq_('../store/StoreFacade.js');

var _storeStoreFacadeJs2 = _interopRequireDefault(_storeStoreFacadeJs);

var _StoreDependencyMixinFieldsJs = _dereq_('./StoreDependencyMixinFields.js');

var _StoreDependencyMixinHandlersJs = _dereq_('./StoreDependencyMixinHandlers.js');

var _StoreDependencyMixinInitializeJs = _dereq_('./StoreDependencyMixinInitialize.js');

var _StoreDependencyMixinStateJs = _dereq_('./StoreDependencyMixinState.js');

var _StoreDependencyMixinTransitionsJs = _dereq_('./StoreDependencyMixinTransitions.js');

function StoreDependencyMixin(dependencyMap) {
  var fieldNames = Object.keys(dependencyMap);
  var isFirstMixin = false;

  return {
    componentWillMount: function componentWillMount() {
      if (!isFirstMixin) {
        return;
      }
      (0, _StoreDependencyMixinHandlersJs.setupHandlers)(this);
    },

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
      if (!isFirstMixin || !(0, _StoreDependencyMixinTransitionsJs.hasPropsChanged)(this.props, nextProps)) {
        return;
      }
      this.setState((0, _StoreDependencyMixinStateJs.getDependencyState)(this, nextProps, this.state, null));
    },

    componentWillUnmount: function componentWillUnmount() {
      if (!isFirstMixin) {
        return;
      }
      (0, _StoreDependencyMixinHandlersJs.cleanupHandlers)(this);
    },

    componentDidUpdate: function componentDidUpdate(oldProps, oldState) {
      if (!isFirstMixin || !(0, _StoreDependencyMixinTransitionsJs.hasStateChanged)((0, _StoreDependencyMixinFieldsJs.dependencies)(this), oldState, this.state)) {
        return;
      }
      this.setState((0, _StoreDependencyMixinStateJs.getDependencyState)(this, this.props, this.state, null));
    },

    getInitialState: function getInitialState() {
      isFirstMixin = !(0, _StoreDependencyMixinFieldsJs.stores)(this).length;
      (0, _StoreDependencyMixinInitializeJs.applyDependencies)(this, dependencyMap);
      return (0, _StoreDependencyMixinStateJs.getDependencyState)(this, this.props, this.state, Object.keys(dependencyMap));
    }
  };
}

module.exports = exports['default'];

},{"../store/StoreFacade.js":14,"./StoreDependencyMixinFields.js":8,"./StoreDependencyMixinHandlers.js":9,"./StoreDependencyMixinInitialize.js":10,"./StoreDependencyMixinState.js":11,"./StoreDependencyMixinTransitions.js":12}],8:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.dependencies = dependencies;
exports.handlers = handlers;
exports.queue = queue;
exports.stores = stores;
exports.storeFields = storeFields;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _eventEventHandlerJs = _dereq_('../event/EventHandler.js');

var _eventEventHandlerJs2 = _interopRequireDefault(_eventEventHandlerJs);

var _storeStoreFacadeJs = _dereq_('../store/StoreFacade.js');

var _storeStoreFacadeJs2 = _interopRequireDefault(_storeStoreFacadeJs);

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

function dependencies(component) {
  return getKey(DEPENDENCIES_KEY, {}, component);
}

function handlers(component) {
  return getKey(HANDLERS_KEY, [], component);
}

function queue(component) {
  return getKey(QUEUE_KEY, {}, component);
}

function stores(component) {
  return getKey(STORES_KEY, [], component);
}

function storeFields(component) {
  return getKey(STORE_FIELDS_KEY, {}, component);
}

},{"../event/EventHandler.js":5,"../store/StoreFacade.js":14}],9:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.cleanupHandlers = cleanupHandlers;
exports.setupHandlers = setupHandlers;

var _StoreDependencyMixinFieldsJs = _dereq_('./StoreDependencyMixinFields.js');

function flushQueue(component) {
  var componentDependencies = (0, _StoreDependencyMixinFieldsJs.dependencies)(component);
  var componentQueue = (0, _StoreDependencyMixinFieldsJs.queue)(component);
  var stateUpdate = {};
  Object.keys(componentQueue).forEach(function (field) {
    var fieldDef = componentDependencies[field];
    stateUpdate[field] = fieldDef.deref(component.props, component.state, fieldDef.stores);
    delete componentQueue[field];
  });
  component.setState(stateUpdate);
}

function waitForOtherStores(component, currentStoreId) {
  var componentStores = (0, _StoreDependencyMixinFieldsJs.stores)(component);
  componentStores.forEach(function (store) {
    var dispatcher = store.getDispatcher();
    if (store.getID() === currentStoreId || !dispatcher.isDispatching()) {
      return;
    }
    dispatcher.waitFor([store.getDispatchToken()]);
  });
}

function handleStoreChange(component, storeId) {
  var componentQueue = (0, _StoreDependencyMixinFieldsJs.queue)(component);
  var queueWasEmpty = Object.keys(componentQueue).length === 0;
  (0, _StoreDependencyMixinFieldsJs.storeFields)(component)[storeId].forEach(function (field) {
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

function cleanupHandlers(component) {
  var componentHandlers = (0, _StoreDependencyMixinFieldsJs.handlers)(component);
  while (componentHandlers.length) {
    componentHandlers.pop().remove();
  }
}

function setupHandlers(component) {
  var componentHandlers = (0, _StoreDependencyMixinFieldsJs.handlers)(component);
  var componentStores = (0, _StoreDependencyMixinFieldsJs.stores)(component);
  componentStores.forEach(function (store) {
    componentHandlers.push(store.addOnChange(handleStoreChange.bind(null, component, store.getID())));
  });
}

},{"./StoreDependencyMixinFields.js":8}],10:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.applyDependencies = applyDependencies;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _invariantJs = _dereq_('../invariant.js');

var _invariantJs2 = _interopRequireDefault(_invariantJs);

var _StoreDependencyMixinFieldsJs = _dereq_('./StoreDependencyMixinFields.js');

var _storeStoreFacadeJs = _dereq_('../store/StoreFacade.js');

var _storeStoreFacadeJs2 = _interopRequireDefault(_storeStoreFacadeJs);

function defaultDeref(props, state, storeInstances) {
  return storeInstances[0].get();
}

function applyDependencies(component, dependencyMap) {
  var componentDependencies = (0, _StoreDependencyMixinFieldsJs.dependencies)(component);
  var componentStoreFields = (0, _StoreDependencyMixinFieldsJs.storeFields)(component);
  var componentStores = (0, _StoreDependencyMixinFieldsJs.stores)(component);
  Object.keys(dependencyMap).forEach(function (field) {
    var dependency = dependencyMap[field];
    var dependencyStores;
    if (dependency instanceof _storeStoreFacadeJs2['default']) {
      dependencyStores = [dependency];
      (0, _invariantJs2['default'])(!componentDependencies.hasOwnProperty(field), 'StoreDependencyMixin: field "%s" is already defined', field);
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

},{"../invariant.js":6,"../store/StoreFacade.js":14,"./StoreDependencyMixinFields.js":8}],11:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getDependencyState = getDependencyState;

var _StoreDependencyMixinFieldsJs = _dereq_('./StoreDependencyMixinFields.js');

function getDependencyState(component, props, state, fieldNames) {
  var componentDependencies = (0, _StoreDependencyMixinFieldsJs.dependencies)(component);
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

},{"./StoreDependencyMixinFields.js":8}],12:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.hasPropsChanged = hasPropsChanged;
exports.hasStateChanged = hasStateChanged;

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

function hasPropsChanged(oldProps, nextProps) {
  return !shallowEqual(compareKey, oldProps, nextProps);
}

function hasStateChanged(stores, oldState, nextState) {
  return !shallowEqual(function (key, objA, objB) {
    return stores.hasOwnProperty(key) || // if the value is a store, ignore it
    compare(objA[key], objB[key]);
  }, oldState, nextState);
}

},{}],13:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatcherDispatcherInstanceJs = _dereq_('../dispatcher/DispatcherInstance.js');

var _dispatcherDispatcherInstanceJs2 = _interopRequireDefault(_dispatcherDispatcherInstanceJs);

var _dispatcherDispatcherInterfaceJs = _dereq_('../dispatcher/DispatcherInterface.js');

var _invariantJs = _dereq_('../invariant.js');

var _invariantJs2 = _interopRequireDefault(_invariantJs);

var _StoreFacadeJs = _dereq_('./StoreFacade.js');

var _StoreFacadeJs2 = _interopRequireDefault(_StoreFacadeJs);

function emptyGetter() {
  return null;
}

var HINT_LINK = 'Learn more about defining stores:' + ' https://github.com/HubSpot/general-store#create-a-store';

var StoreDefinition = (function () {
  function StoreDefinition() {
    _classCallCheck(this, StoreDefinition);

    this._facade = null;
    this._getter = null;
    this._responses = {};
  }

  _createClass(StoreDefinition, [{
    key: 'defineGet',
    value: function defineGet(getter) {
      (0, _invariantJs2['default'])(!this.isRegistered(), 'StoreDefinition.defineGet: this store definition cannot be modified' + ' because is has already been registered with a dispatcher. %s', HINT_LINK);
      (0, _invariantJs2['default'])(typeof getter === 'function', 'StoreDefinition.defineGet: expected getter to be a function but got' + ' "%s" instead. %s', getter, HINT_LINK);
      this._getter = getter;
      return this;
    }
  }, {
    key: 'defineResponseTo',
    value: function defineResponseTo(actionTypes, response) {
      var _this = this;

      (0, _invariantJs2['default'])(!this.isRegistered(), 'StoreDefinition.defineResponseTo: this store definition cannot be' + ' modified because is has already been registered with a dispatcher. %s', HINT_LINK);
      [].concat(actionTypes).forEach(function (actionType) {
        return _this._setResponse(actionType, response);
      });
      return this;
    }
  }, {
    key: 'isRegistered',
    value: function isRegistered() {
      return this._facade instanceof _StoreFacadeJs2['default'];
    }
  }, {
    key: 'register',
    value: function register(dispatcher) {
      dispatcher = dispatcher || _dispatcherDispatcherInstanceJs2['default'].get();
      (0, _invariantJs2['default'])(dispatcher !== null && typeof dispatcher === 'object', 'StoreDefinition.register: you haven\'t provide a dispatcher instance.' + ' You can pass an instance to' + ' GeneralStore.define().register(dispatcher) or use' + ' GeneralStore.DispatcherInstance.set(dispatcher) to set a global' + ' instance.' + ' https://github.com/HubSpot/general-store#default-dispatcher-instance');
      (0, _invariantJs2['default'])((0, _dispatcherDispatcherInterfaceJs.isDispatcher)(dispatcher), 'StoreDefinition.register: Expected dispatcher to be an object' + ' with a register method, and an unregister method but got "%s".' + ' Learn more about the dispatcher interface:' + ' https://github.com/HubSpot/general-store#dispatcher-interface', dispatcher);
      (0, _invariantJs2['default'])(typeof this._getter === 'function', 'StoreDefinition.register: a store cannot be registered without a' + ' getter. Use GeneralStore.define().defineGet(getter) to define a' + ' getter. %s', HINT_LINK);
      var facade = this._facade || new _StoreFacadeJs2['default'](this._getter || emptyGetter, this._responses, dispatcher);
      if (this._facade === null) {
        this._facade = facade;
      }
      return facade;
    }
  }, {
    key: '_setResponse',
    value: function _setResponse(actionType, response) {
      (0, _invariantJs2['default'])(typeof actionType === 'string', 'StoreDefinition.defineResponseTo: expected actionType to be a string' + ' but got "%s" instead. %s', actionType, HINT_LINK);
      (0, _invariantJs2['default'])(!this._responses.hasOwnProperty(actionType), 'StoreDefinition.defineResponseTo: conflicting resposes for actionType' + ' "%s". Only one response can be defined per actionType per Store. %s', actionType, HINT_LINK);
      (0, _invariantJs2['default'])(typeof response === 'function', 'StoreDefinition.defineResponseTo: expected response to be a function' + ' but got "%s" instead. %s', response);
      this._responses[actionType] = response;
    }
  }]);

  return StoreDefinition;
})();

exports['default'] = StoreDefinition;
module.exports = exports['default'];

},{"../dispatcher/DispatcherInstance.js":2,"../dispatcher/DispatcherInterface.js":3,"../invariant.js":6,"./StoreFacade.js":14}],14:[function(_dereq_,module,exports){
/* eslint no-console:0 */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _dispatcherDispatcherInterfaceJs = _dereq_('../dispatcher/DispatcherInterface.js');

var _eventEventJs = _dereq_('../event/Event.js');

var _eventEventJs2 = _interopRequireDefault(_eventEventJs);

var _eventEventHandlerJs = _dereq_('../event/EventHandler.js');

var _eventEventHandlerJs2 = _interopRequireDefault(_eventEventHandlerJs);

var _invariantJs = _dereq_('../invariant.js');

var _invariantJs2 = _interopRequireDefault(_invariantJs);

var _uniqueidUniqueIDJs = _dereq_('../uniqueid/uniqueID.js');

var _uniqueidUniqueIDJs2 = _interopRequireDefault(_uniqueidUniqueIDJs);

var HINT_LINK = 'Learn more about using the Store API:' + ' https://github.com/HubSpot/general-store#using-the-store-api';

function getNull() {
  return null;
}

var StoreFacade = (function () {
  function StoreFacade(getter, responses, dispatcher) {
    _classCallCheck(this, StoreFacade);

    this._dispatcher = dispatcher;
    this._getter = getter;
    this._responses = responses;
    this._event = new _eventEventJs2['default']();
    this._uid = (0, _uniqueidUniqueIDJs2['default'])();

    this._dispatchToken = this._dispatcher.register(this._handleDispatch.bind(this));
  }

  /**
   * Subscribe to changes on this store.
   *
   * @param  callback  will run every time the store responds to a dispatcher
   * @return this
   */

  _createClass(StoreFacade, [{
    key: 'addOnChange',
    value: function addOnChange(callback) {
      (0, _invariantJs2['default'])(typeof callback === 'function', 'StoreFacade.addOnChange: expected callback to be a function' + ' but got "%s" instead. %s', callback, HINT_LINK);
      return this._event.addHandler(callback);
    }

    /**
     * Returns the store's referenced value
     *
     * @param  ...  accepts any number of params
     * @return any
     */
  }, {
    key: 'get',
    value: function get() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return this._getter.apply(null, args);
    }

    /**
     * Exposes the store's dispatcher instance.
     *
     * @return Dispatcher
     */
  }, {
    key: 'getDispatcher',
    value: function getDispatcher() {
      return this._dispatcher;
    }

    /**
     * Exposes the token assigned to the store by the dispatcher
     *
     * @return number
     */
  }, {
    key: 'getDispatchToken',
    value: function getDispatchToken() {
      return this._dispatchToken;
    }
  }, {
    key: 'getID',
    value: function getID() {
      return this._uid;
    }

    /**
     * @protected
     * Responds to incoming messages from the Dispatcher
     */
  }, {
    key: '_handleDispatch',
    value: function _handleDispatch(payload) {
      if ("development" !== 'production') {
        (0, _invariantJs2['default'])((0, _dispatcherDispatcherInterfaceJs.isPayload)(payload), 'StoreFacade: expected dispatched payload to be an object with a' + ' property "actionType" containing a string and an optional property' + ' "data" containing any value but got "%s" instead. Learn more about' + ' the dispatcher interface:' + ' https://github.com/HubSpot/general-store#dispatcher-interface');
      }
      if (!this._responses.hasOwnProperty(payload.actionType)) {
        return;
      }
      this._responses[payload.actionType](payload.data, payload.actionType, payload);
      this.triggerChange();
    }

    /**
     * Destroys this instance of the store.
     * Dispatch callback is unregistered. Subscriptions are removed.
     */
  }, {
    key: 'remove',
    value: function remove() {
      this._dispatcher.unregister(this.getDispatchToken());
      this._event.remove();
      this._getter = getNull;
      this._responses = {};
    }

    /**
     * Runs all of the store's subscription callbacks
     *
     * @return this
     */
  }, {
    key: 'triggerChange',
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

exports['default'] = StoreFacade;
module.exports = exports['default'];

},{"../dispatcher/DispatcherInterface.js":3,"../event/Event.js":4,"../event/EventHandler.js":5,"../invariant.js":6,"../uniqueid/uniqueID.js":15}],15:[function(_dereq_,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = uid;

var PREFIX = 'uid_';

var nextUid = 0;

function uid() {
  return PREFIX + nextUid++;
}

module.exports = exports['default'];

},{}]},{},[1])(1)
});