!function(e) {
  if ("object" == typeof exports && "undefined" != typeof module) module.exports = e(); else if ("function" == typeof define && define.amd) define([], e); else {
    var f;
    "undefined" != typeof window ? f = window : "undefined" != typeof global ? f = global : "undefined" != typeof self && (f = self), 
    f.GeneralStore = e();
  }
}(function() {
  var define, module, exports;
  return function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = typeof require == "function" && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n ? n : e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  }({
    1: [ function(_dereq_, module, exports) {
      /* @flow */
      var StoreDefinition = _dereq_("./store/StoreDefinition.js");
      var GeneralStore = {
        define: function() {
          return new StoreDefinition();
        },
        DispatcherInstance: _dereq_("./dispatcher/DispatcherInstance.js"),
        StoreDependencyMixin: _dereq_("./mixin/StoreDependencyMixin.js")
      };
      module.exports = GeneralStore;
    }, {
      "./dispatcher/DispatcherInstance.js": 2,
      "./mixin/StoreDependencyMixin.js": 6,
      "./store/StoreDefinition.js": 8
    } ],
    2: [ function(_dereq_, module, exports) {
      /**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * @flow weak
 **/
      var $__0 = _dereq_("../hints/TypeHints.js"), enforceDispatcherInterface = $__0.enforceDispatcherInterface;
      var instance = null;
      var DispatcherInstance = {
        get: function() {
          if (!instance) {
            throw new Error("set a dispatcher please");
          }
          return instance;
        },
        set: function(dispatcher) {
          enforceDispatcherInterface(dispatcher, "DispatcherInstance");
          instance = dispatcher;
        }
      };
      module.exports = DispatcherInstance;
    }, {
      "../hints/TypeHints.js": 5
    } ],
    3: [ function(_dereq_, module, exports) {
      /**
 * @flow
 */
      var EventHandler = _dereq_("./EventHandler.js");
      var uniqueID = _dereq_("../uniqueid/uniqueID.js");
      function Event() {
        "use strict";
        this.$Event_handlers = {};
      }
      /**
   * Add a subscription to this event
   *
   * @param  callback  run when the event is triggered.
   * @return this
   */
      Event.prototype.addHandler = function(callback) {
        "use strict";
        var key = uniqueID();
        this.$Event_handlers[key] = callback;
        return new EventHandler(this, key);
      };
      /**
   * Destroys this event. Removes all handlers.
   *
   * @return this
   */
      Event.prototype.remove = function() {
        "use strict";
        this.$Event_handlers = {};
        return this;
      };
      /**
   * Removes a subscription by key.
   *
   * @param  key   id of the subscription to remove
   * @return this
   */
      Event.prototype.removeHandler = function(key) {
        "use strict";
        delete this.$Event_handlers[key];
        return this;
      };
      /**
   * @protected
   * Run a handler by key if it exists
   *
   * @param  key  id of the handler to run
   */
      Event.prototype.$Event_runHandler = function(key) {
        "use strict";
        if (this.$Event_handlers.hasOwnProperty(key)) {
          this.$Event_handlers[key].call();
        }
      };
      /**
   * Run all subscribed handlers.
   *
   * @return this
   */
      Event.prototype.runHandlers = function() {
        "use strict";
        Object.keys(this.$Event_handlers).forEach(this.$Event_runHandler.bind(this));
        return this;
      };
      /**
 * Convenience method for running multiple events.
 *
 * @param  events  a list of events to run.
 */
      Event.runMultiple = function(events) {
        events.forEach(function(evt) {
          return evt.runHandlers();
        });
      };
      module.exports = Event;
    }, {
      "../uniqueid/uniqueID.js": 11,
      "./EventHandler.js": 4
    } ],
    4: [ function(_dereq_, module, exports) {
      /**
 * @flow
 */
      function EventHandler(instance, key) {
        "use strict";
        this.$EventHandler_key = key;
        this.$EventHandler_instance = instance;
      }
      EventHandler.prototype.remove = function() {
        "use strict";
        if (this.$EventHandler_instance === null || this.$EventHandler_instance === undefined) {
          return;
        }
        this.$EventHandler_instance.removeHandler(this.$EventHandler_key);
        this.$EventHandler_instance = null;
      };
      module.exports = EventHandler;
    }, {} ],
    5: [ function(_dereq_, module, exports) {
      /* @flow */
      function composeError(args) {
        return new Error(args.join(" "));
      }
      var TypeHints = {
        enforceDispatcherInterface: function(dispatcher, scope) {
          if ("development" !== "production") {
            if (dispatcher === null || dispatcher === undefined) {
              throw composeError([ scope, ": DispatcherInstance is not defined" ]);
            }
            if (typeof dispatcher !== "object" || typeof dispatcher.register !== "function") {
              throw composeError([ scope, ': expected an object with a register method but got "', dispatcher, '" instead.' ]);
            }
          }
        },
        enforceIsFunction: function(arg, scope) {
          if ("development" !== "production") {
            if (typeof arg !== "function") {
              throw composeError([ scope, ': expected a function but got "', arg, '" instead.' ]);
            }
          }
        },
        enforceIsString: function(arg, scope) {
          if ("development" !== "production") {
            if (typeof arg !== "string") {
              throw composeError([ scope, ': expected a string but got "', arg, '" instead.' ]);
            }
          }
        },
        enforceKeyIsDefined: function(context, key, scope) {
          if ("development" !== "production") {
            if (!context.hasOwnProperty(key)) {
              throw composeError([ scope, ': "', key, '" is not defined.' ]);
            }
          }
        },
        enforceKeyIsNotDefined: function(context, key, scope) {
          if ("development" !== "production") {
            if (context.hasOwnProperty(key)) {
              throw composeError([ scope, ': "', key, '" is already defined.' ]);
            }
          }
        }
      };
      module.exports = TypeHints;
    }, {} ],
    6: [ function(_dereq_, module, exports) {
      /**
 * @flow
 */
      var EventHandler = _dereq_("../event/EventHandler.js");
      var StoreDependencyDefinition = _dereq_("../store/StoreDependencyDefinition.js");
      var StoreFacade = _dereq_("../store/StoreFacade.js");
      function havePropsChanged(oldProps, nextProps) {
        return Object.keys(nextProps).some(function(key) {
          return oldProps[key] !== nextProps[key];
        });
      }
      function hasStateChanged(stores, oldState, nextState) {
        return Object.keys(nextState).some(function(key) {
          return !stores.hasOwnProperty(key) && oldState[key] !== nextState[key];
        });
      }
      function storeChangeCallback(component, dependencies, key) {
        component.setState(dependencies.getStateField(key, component.props, component.state || {}));
      }
      function StoreDependencyMixin(dependencyMap) {
        var dependencies = new StoreDependencyDefinition(dependencyMap);
        var hasCustomDerefs = Object.keys(dependencyMap).some(function(key) {
          return dependencyMap[key].deref;
        });
        return {
          componentWillMount: function() {
            var stores = dependencies.getStores();
            this._storeDependencyHandlers = Object.keys(stores).map(function(key) {
              return stores[key].addOnChange(storeChangeCallback.bind(null, this, dependencies, key));
            }.bind(this));
          },
          componentWillUnmount: function() {
            var handlers = this._storeDependencyHandlers;
            while (handlers.length) {
              handlers.pop().remove();
            }
          },
          componentWillUpdate: function(nextProps, nextState) {
            if (!hasCustomDerefs) {
              return;
            }
            if (!havePropsChanged(this.props, nextProps) && !hasStateChanged(dependencies.getStores(), this.state, nextState)) {
              return;
            }
            this.setState(dependencies.getState(nextProps, nextState || {}));
          },
          getInitialState: function() {
            return dependencies.getState(this.props, this.state || {});
          }
        };
      }
      module.exports = StoreDependencyMixin;
    }, {
      "../event/EventHandler.js": 4,
      "../store/StoreDependencyDefinition.js": 9,
      "../store/StoreFacade.js": 10
    } ],
    7: [ function(_dereq_, module, exports) {
      /* @flow */
      var StoreConstants = {
        DEFAULT_GETTER_KEY: "DEFAULT_GETTER_KEY"
      };
      module.exports = StoreConstants;
    }, {} ],
    8: [ function(_dereq_, module, exports) {
      /* @flow */
      var DispatcherInstance = _dereq_("../dispatcher/DispatcherInstance.js");
      var StoreConstants = _dereq_("./StoreConstants.js");
      var StoreFacade = _dereq_("./StoreFacade.js");
      var $__0 = _dereq_("../hints/TypeHints.js"), enforceDispatcherInterface = $__0.enforceDispatcherInterface, enforceIsFunction = $__0.enforceIsFunction, enforceIsString = $__0.enforceIsString, enforceKeyIsNotDefined = $__0.enforceKeyIsNotDefined;
      var SCOPE_HINT = "StoreDefinition";
      function emptyGetter() {
        return null;
      }
      function StoreDefinition() {
        "use strict";
        this.$StoreDefinition_facade = null;
        this.$StoreDefinition_getter = null;
        this.$StoreDefinition_responses = {};
      }
      StoreDefinition.prototype.defineGet = function(getter) {
        "use strict";
        enforceIsFunction(getter, SCOPE_HINT);
        this.$StoreDefinition_enforceIsUnregistered();
        this.$StoreDefinition_getter = getter;
        return this;
      };
      StoreDefinition.prototype.defineResponseTo = function(actionType, response) {
        "use strict";
        enforceIsString(actionType, SCOPE_HINT);
        enforceIsFunction(response, SCOPE_HINT);
        enforceKeyIsNotDefined(this.$StoreDefinition_responses, actionType, SCOPE_HINT);
        this.$StoreDefinition_enforceIsUnregistered();
        this.$StoreDefinition_responses[actionType] = response;
        return this;
      };
      StoreDefinition.prototype.$StoreDefinition_enforceIsReadyForRegistration = function() {
        "use strict";
        if ("development" !== "production") {
          if (typeof this.$StoreDefinition_getter !== "function") {
            throw new Error(SCOPE_HINT + ": you must call defineGet before calling register.");
          }
        }
      };
      StoreDefinition.prototype.$StoreDefinition_enforceIsUnregistered = function() {
        "use strict";
        if ("development" !== "production") {
          if (this.$StoreDefinition_facade !== null) {
            throw new Error(SCOPE_HINT + ": a store definition cannot be modified after it is registered");
          }
        }
      };
      StoreDefinition.prototype.register = function(dispatcher) {
        "use strict";
        this.$StoreDefinition_enforceIsReadyForRegistration();
        if (dispatcher) {
          enforceDispatcherInterface(dispatcher, SCOPE_HINT);
        }
        var facade = this.$StoreDefinition_facade || new StoreFacade(this.$StoreDefinition_getter || emptyGetter, this.$StoreDefinition_responses, dispatcher || DispatcherInstance.get());
        if (this.$StoreDefinition_facade === null) {
          this.$StoreDefinition_facade = facade;
        }
        return facade;
      };
      module.exports = StoreDefinition;
    }, {
      "../dispatcher/DispatcherInstance.js": 2,
      "../hints/TypeHints.js": 5,
      "./StoreConstants.js": 7,
      "./StoreFacade.js": 10
    } ],
    9: [ function(_dereq_, module, exports) {
      /**
 * @flow
 */
      var StoreFacade = _dereq_("./StoreFacade.js");
      function defaultDeref(_, _, store) {
        return store.get();
      }
      function StoreDependencyDefinition(dependencyMap) {
        "use strict";
        this.$StoreDependencyDefinition_derefs = {};
        this.$StoreDependencyDefinition_stores = {};
        Object.keys(dependencyMap).forEach(function(key) {
          if (dependencyMap[key] instanceof StoreFacade) {
            this.$StoreDependencyDefinition_derefs[key] = defaultDeref;
            this.$StoreDependencyDefinition_stores[key] = dependencyMap[key];
          } else {
            this.$StoreDependencyDefinition_derefs[key] = dependencyMap[key].deref || defaultDeref;
            this.$StoreDependencyDefinition_stores[key] = dependencyMap[key].store;
          }
        }.bind(this));
      }
      StoreDependencyDefinition.prototype.$StoreDependencyDefinition_derefStore = function(key, props, state) {
        "use strict";
        return this.$StoreDependencyDefinition_derefs[key](props, state, this.$StoreDependencyDefinition_stores[key]);
      };
      StoreDependencyDefinition.prototype.getState = function(props, state) {
        "use strict";
        var updates = {};
        for (var key in this.$StoreDependencyDefinition_stores) {
          updates[key] = this.$StoreDependencyDefinition_derefStore(key, props, state);
        }
        return updates;
      };
      StoreDependencyDefinition.prototype.getStateField = function(key, props, state) {
        "use strict";
        var update = {};
        update[key] = this.$StoreDependencyDefinition_derefStore(key, props, state);
        return update;
      };
      StoreDependencyDefinition.prototype.getStores = function() {
        "use strict";
        return this.$StoreDependencyDefinition_stores;
      };
      module.exports = StoreDependencyDefinition;
    }, {
      "./StoreFacade.js": 10
    } ],
    10: [ function(_dereq_, module, exports) {
      /* @flow */
      var Event = _dereq_("../event/Event.js");
      var EventHandler = _dereq_("../event/EventHandler.js");
      var StoreConstants = _dereq_("./StoreConstants.js");
      var $__0 = _dereq_("../hints/TypeHints.js"), enforceKeyIsDefined = $__0.enforceKeyIsDefined, enforceIsFunction = $__0.enforceIsFunction;
      var SCOPE_HINT = "StoreFacade";
      function getNull() {
        return null;
      }
      function StoreFacade(getter, responses, dispatcher) {
        "use strict";
        this.$StoreFacade_dispatcher = dispatcher;
        this.$StoreFacade_getter = getter;
        this.$StoreFacade_responses = responses;
        this.$StoreFacade_event = new Event();
        this.$StoreFacade_dispatchToken = this.$StoreFacade_dispatcher.register(this.$StoreFacade_handleDispatch.bind(this));
      }
      /**
   * Subscribe to changes on this store.
   *
   * @param  callback  will run every time the store responds to a dispatcher
   * @return this
   */
      StoreFacade.prototype.addOnChange = function(callback) {
        "use strict";
        enforceIsFunction(callback, SCOPE_HINT);
        return this.$StoreFacade_event.addHandler(callback);
      };
      /**
   * Returns the store's referenced value
   *
   * @param  ...  accepts any number of params
   * @return any
   */
      StoreFacade.prototype.get = function() {
        "use strict";
        for (var args = [], $__0 = 0, $__1 = arguments.length; $__0 < $__1; $__0++) args.push(arguments[$__0]);
        return this.$StoreFacade_getter.apply(null, args);
      };
      /**
   * Exposes the store's dispatcher instance.
   *
   * @return Dispatcher
   */
      StoreFacade.prototype.getDispatcher = function() {
        "use strict";
        return this.$StoreFacade_dispatcher;
      };
      /**
   * Exposes the token assigned to the store by the dispatcher
   *
   * @return number
   */
      StoreFacade.prototype.getDispatchToken = function() {
        "use strict";
        return this.$StoreFacade_dispatchToken;
      };
      /**
   * @protected
   * Responds to incoming messages from the Dispatcher
   */
      StoreFacade.prototype.$StoreFacade_handleDispatch = function($__0) {
        "use strict";
        var actionType = $__0.actionType, data = $__0.data;
        if (!this.$StoreFacade_responses.hasOwnProperty(actionType)) {
          return;
        }
        this.$StoreFacade_responses[actionType](data, actionType);
        this.triggerChange();
      };
      /**
   * Destroys this instance of the store.
   * Dispatch callback is unregistered. Subscriptions are removed.
   */
      StoreFacade.prototype.remove = function() {
        "use strict";
        this.$StoreFacade_dispatcher.unregister(this.getDispatchToken());
        this.$StoreFacade_event.remove();
        this.$StoreFacade_getter = getNull;
        this.$StoreFacade_responses = {};
      };
      /**
   * Runs all of the store's subscription callbacks
   *
   * @return this
   */
      StoreFacade.prototype.triggerChange = function() {
        "use strict";
        this.$StoreFacade_event.runHandlers();
        return this;
      };
      module.exports = StoreFacade;
    }, {
      "../event/Event.js": 3,
      "../event/EventHandler.js": 4,
      "../hints/TypeHints.js": 5,
      "./StoreConstants.js": 7
    } ],
    11: [ function(_dereq_, module, exports) {
      /**
 * @flow
 */
      var nextUid = 0;
      function uid() {
        return nextUid++;
      }
      module.exports = uid;
    }, {} ]
  }, {}, [ 1 ])(1);
});