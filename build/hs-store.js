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
    1: [ function(require, module, exports) {
      /* @flow */
      var StoreDefinition = require("./store/StoreDefinition.js");
      var GeneralStore = {
        define: function() {
          return new StoreDefinition();
        },
        DispatcherInstance: require("./dispatcher/DispatcherInstance.js"),
        StoreListenerMixin: require("./react/StoreListenerMixin.js")
      };
      module.exports = GeneralStore;
    }, {
      "./dispatcher/DispatcherInstance.js": 3,
      "./react/StoreListenerMixin.js": 4,
      "./store/StoreDefinition.js": 6
    } ],
    2: [ function(require, module, exports) {
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
    3: [ function(require, module, exports) {
      /**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * @flow weak
 **/
      var $__0 = require("../core/hints/TypeHints.js"), enforceDispatcherInterface = $__0.enforceDispatcherInterface;
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
      "../core/hints/TypeHints.js": 2
    } ],
    4: [ function(require, module, exports) {
      /* @flow */
      var StoreFacade = require("../store/StoreFacade.js");
      var StoreListenerMixin = {
        componentWillMount: function() {
          if ("development" !== "production") {
            if (typeof this.getStoreState !== "function") {
              throw new Error("StoreListenerMixin: expected this.getStoreState to be a function.");
            }
            if (!Array.isArray(this.stores)) {
              throw new Error("StoreListenerMixin: this.stores must be an array of stores.");
            }
            if (this.stores.length < 1) {
              throw new Error("StoreListenerMixin: no stores are defined in this.stores.");
            }
          }
          this.handleStoreChange = this.handleStoreChange.bind(this);
          this.stores.forEach(function(store) {
            return store.addOnChange(this.handleStoreChange);
          }.bind(this));
          this.handleStoreChange();
        },
        componentWillUnmount: function() {
          this.stores.forEach(function(store) {
            return store.removeOnChange(this._handleStoreChange);
          }.bind(this));
        },
        handleStoreChange: function() {
          this.setState(this.getStoreState());
        }
      };
      module.exports = StoreListenerMixin;
    }, {
      "../store/StoreFacade.js": 7
    } ],
    5: [ function(require, module, exports) {
      /* @flow */
      var StoreConstants = {
        DEFAULT_GETTER_KEY: "DEFAULT_GETTER_KEY"
      };
      module.exports = StoreConstants;
    }, {} ],
    6: [ function(require, module, exports) {
      /* @flow */
      var DispatcherInstance = require("../dispatcher/DispatcherInstance.js");
      var StoreConstants = require("./StoreConstants.js");
      var StoreFacade = require("./StoreFacade.js");
      var $__0 = require("../core/hints/TypeHints.js"), enforceDispatcherInterface = $__0.enforceDispatcherInterface, enforceIsFunction = $__0.enforceIsFunction, enforceIsString = $__0.enforceIsString, enforceKeyIsNotDefined = $__0.enforceKeyIsNotDefined;
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
      "../core/hints/TypeHints.js": 2,
      "../dispatcher/DispatcherInstance.js": 3,
      "./StoreConstants.js": 5,
      "./StoreFacade.js": 7
    } ],
    7: [ function(require, module, exports) {
      /* @flow */
      var StoreConstants = require("./StoreConstants.js");
      var $__0 = require("../core/hints/TypeHints.js"), enforceKeyIsDefined = $__0.enforceKeyIsDefined, enforceIsFunction = $__0.enforceIsFunction;
      var SCOPE_HINT = "StoreFacade";
      function StoreFacade(getter, responses, dispatcher) {
        "use strict";
        this.$StoreFacade_dispatcher = dispatcher;
        this.$StoreFacade_getter = getter;
        this.$StoreFacade_responses = responses;
        this.$StoreFacade_listeners = [];
        this.$StoreFacade_dispatchToken = this.$StoreFacade_dispatcher.register(function(data) {
          return this.$StoreFacade_handleDispatch(data);
        }.bind(this));
      }
      StoreFacade.prototype.addOnChange = function(callback) {
        "use strict";
        enforceIsFunction(callback, SCOPE_HINT);
        this.$StoreFacade_listeners.push(callback);
        return this;
      };
      StoreFacade.prototype.get = function() {
        "use strict";
        for (var args = [], $__0 = 0, $__1 = arguments.length; $__0 < $__1; $__0++) args.push(arguments[$__0]);
        return this.$StoreFacade_getter.apply(null, args);
      };
      StoreFacade.prototype.getDispatcher = function() {
        "use strict";
        return this.$StoreFacade_dispatcher;
      };
      StoreFacade.prototype.getDispatchToken = function() {
        "use strict";
        return this.$StoreFacade_dispatchToken;
      };
      StoreFacade.prototype.$StoreFacade_handleDispatch = function($__0) {
        "use strict";
        var actionType = $__0.actionType, data = $__0.data;
        if (!this.$StoreFacade_responses.hasOwnProperty(actionType)) {
          return;
        }
        this.$StoreFacade_responses[actionType](data, actionType);
        this.triggerChange();
      };
      StoreFacade.prototype.removeOnChange = function(callback) {
        "use strict";
        var index = this.$StoreFacade_listeners.indexOf(callback);
        if (index !== -1) {
          this.$StoreFacade_listeners.splice(index, 1);
        }
        return this;
      };
      StoreFacade.prototype.triggerChange = function() {
        "use strict";
        this.$StoreFacade_listeners.forEach(function(listener) {
          return listener.call();
        });
        return this;
      };
      module.exports = StoreFacade;
    }, {
      "../core/hints/TypeHints.js": 2,
      "./StoreConstants.js": 5
    } ]
  }, {}, [ 1 ])(1);
});