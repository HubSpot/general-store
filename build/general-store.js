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
      (function(root, factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
          define([], factory);
        } else if (typeof exports === "object") {
          module.exports = factory();
        } else {
          root.f = factory();
        }
      })(this, function() {
        "use strict";
        function Failure(actual, expected, ctx) {
          this.actual = actual;
          this.expected = expected;
          this.ctx = ctx;
        }
        Failure.prototype.toString = function() {
          var ctx = this.ctx ? this.ctx.join(" / ") : "";
          ctx = ctx ? ", context: " + ctx : ", (no context)";
          return "Expected an instance of " + this.expected.name + " got " + JSON.stringify(this.actual) + ctx;
        };
        function Type(name, validate, is) {
          this.name = name;
          this.validate = validate;
          if (is) {
            this.is = is;
          }
        }
        Type.prototype.is = function(x) {
          return this.validate(x, null, true) === null;
        };
        function define(name, is) {
          var type = new Type(name, function(x, ctx) {
            return is(x) ? null : [ new Failure(x, type, ctx) ];
          }, is);
          return type;
        }
        var Any = define("any", function() {
          return true;
        });
        var Mixed = define("mixed", function() {
          return true;
        });
        var Void = define("void", function(x) {
          return x === void 0;
        });
        var Str = define("string", function(x) {
          return typeof x === "string";
        });
        var Num = define("number", function(x) {
          return typeof x === "number";
        });
        var Bool = define("boolean", function(x) {
          return x === true || x === false;
        });
        var Arr = define("array", function(x) {
          return x instanceof Array;
        });
        var Obj = define("object", function(x) {
          return x != null && typeof x === "object" && !Arr.is(x);
        });
        var Func = define("function", function(x) {
          return typeof x === "function";
        });
        function validate(x, type, ctx, fast) {
          if (type.validate) {
            return type.validate(x, ctx, fast);
          }
          return x instanceof type ? null : [ new Failure(x, type, ctx) ];
        }
        function list(type, name) {
          name = name || "Array<" + type.name + ">";
          return new Type(name, function(x, ctx, fast) {
            ctx = ctx || [];
            ctx.push(name);
            // if x is not an array, fail fast
            if (!Arr.is(x)) {
              return [ new Failure(x, Arr, ctx) ];
            }
            var errors = null, suberrors;
            for (var i = 0, len = x.length; i < len; i++) {
              suberrors = validate(x[i], type, ctx.concat(i));
              if (suberrors) {
                if (fast) {
                  return suberrors;
                }
                errors = errors || [];
                errors.push.apply(errors, suberrors);
              }
            }
            return errors;
          });
        }
        function optional(type, name) {
          name = name || type.name + "?";
          return new Type(name, function(x, ctx, fast) {
            if (x === void 0) {
              return null;
            }
            ctx = ctx || [];
            ctx.push(name);
            return validate(x, type, ctx, fast);
          });
        }
        function maybe(type, name) {
          name = name || "?" + type.name;
          return new Type(name, function(x, ctx, fast) {
            if (x === null) {
              return null;
            }
            ctx = ctx || [];
            ctx.push(name);
            return validate(x, type, ctx, fast);
          });
        }
        function getName(type) {
          return type.name;
        }
        function tuple(types, name) {
          name = name || "[" + types.map(getName).join(", ") + "]";
          var dimension = types.length;
          var type = new Type(name, function(x, ctx, fast) {
            ctx = ctx || [];
            // if x is not an array, fail fast
            if (!Arr.is(x)) {
              return [ new Failure(x, Arr, ctx.concat(name)) ];
            }
            // if x has a wrong length, fail fast
            if (x.length !== dimension) {
              return [ new Failure(x, type, ctx) ];
            }
            var errors = null, suberrors;
            for (var i = 0; i < dimension; i++) {
              suberrors = validate(x[i], types[i], ctx.concat(name, i));
              if (suberrors) {
                if (fast) {
                  return suberrors;
                }
                errors = errors || [];
                errors.push.apply(errors, suberrors);
              }
            }
            return errors;
          });
          return type;
        }
        function dict(domain, codomain, name) {
          name = name || "{[key: " + domain.name + "]: " + codomain.name + "}";
          return new Type(name, function(x, ctx, fast) {
            ctx = ctx || [];
            // if x is not an object, fail fast
            if (!Obj.is(x)) {
              return [ new Failure(x, Obj, ctx.concat(name)) ];
            }
            var errors = null, suberrors;
            for (var k in x) {
              if (x.hasOwnProperty(k)) {
                // check domain
                suberrors = validate(k, domain, ctx.concat(name, k));
                if (suberrors) {
                  if (fast) {
                    return suberrors;
                  }
                  errors = errors || [];
                  errors.push.apply(errors, suberrors);
                }
                // check codomain
                suberrors = validate(x[k], codomain, ctx.concat(name, k));
                if (suberrors) {
                  if (fast) {
                    return suberrors;
                  }
                  errors = errors || [];
                  errors.push.apply(errors, suberrors);
                }
              }
            }
            return errors;
          });
        }
        function shape(props, name) {
          name = name || "{" + Object.keys(props).map(function(k) {
            return k + ": " + props[k].name + ";";
          }).join(" ") + "}";
          return new Type(name, function(x, ctx, fast) {
            ctx = ctx || [];
            // if x is not an object, fail fast
            if (!Obj.is(x)) {
              return [ new Failure(x, Obj, ctx.concat(name)) ];
            }
            var errors = null, suberrors;
            for (var k in props) {
              if (props.hasOwnProperty(k)) {
                suberrors = validate(x[k], props[k], ctx.concat(name, k));
                if (suberrors) {
                  if (fast) {
                    return suberrors;
                  }
                  errors = errors || [];
                  errors.push.apply(errors, suberrors);
                }
              }
            }
            return errors;
          });
        }
        function union(types, name) {
          name = name || types.map(getName).join(" | ");
          var type = new Type(name, function(x, ctx) {
            if (types.some(function(type) {
              return type.is(x);
            })) {
              return null;
            }
            ctx = ctx || [];
            return [ new Failure(x, type, ctx.concat(name)) ];
          });
          return type;
        }
        function slice(arr, start, end) {
          return Array.prototype.slice.call(arr, start, end);
        }
        function args(types, varargs) {
          var name = "(" + types.map(getName).join(", ") + ", ..." + (varargs || Any).name + ")";
          var len = types.length;
          var typesTuple = tuple(types);
          if (varargs) {
            varargs = list(varargs);
          }
          return new Type(name, function(x, ctx, fast) {
            ctx = ctx || [];
            var args = x;
            // test if args is an array-like structure
            if (args.hasOwnProperty("length")) {
              args = slice(args, 0, len);
              // handle optional arguments filling the array with undefined values
              if (args.length < len) {
                args.length = len;
              }
            }
            var errors = null, suberrors;
            suberrors = typesTuple.validate(args, ctx.concat("arguments"), fast);
            if (suberrors) {
              if (fast) {
                return suberrors;
              }
              errors = errors || [];
              errors.push.apply(errors, suberrors);
            }
            if (varargs) {
              suberrors = varargs.validate(slice(x, len), ctx.concat("varargs"), fast);
              if (suberrors) {
                if (fast) {
                  return suberrors;
                }
                errors = errors || [];
                errors.push.apply(errors, suberrors);
              }
            }
            return errors;
          });
        }
        function check(x, type) {
          var errors = validate(x, type);
          if (errors) {
            var message = [].concat(errors).join("\n");
            debugger;
            throw new TypeError(message);
          }
          return x;
        }
        var exports = {
          Type: Type,
          define: define,
          any: Any,
          mixed: Mixed,
          "void": Void,
          number: Num,
          string: Str,
          "boolean": Bool,
          object: Obj,
          "function": Func,
          list: list,
          optional: optional,
          maybe: maybe,
          tuple: tuple,
          dict: dict,
          shape: shape,
          union: union,
          arguments: args,
          check: check
        };
        return exports;
      });
    }, {} ],
    2: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /* @flow */
      var StoreDefinition = _dereq_("./store/StoreDefinition.js");
      var GeneralStore = {
        define: function() {
          var ret = function() {
            return new StoreDefinition();
          }.apply(this, arguments);
          return _f.check(ret, StoreDefinition);
        },
        DispatcherInstance: _dereq_("./dispatcher/DispatcherInstance.js"),
        StoreDependencyMixin: _dereq_("./mixin/StoreDependencyMixin.js")
      };
      module.exports = GeneralStore;
    }, {
      "./dispatcher/DispatcherInstance.js": 3,
      "./mixin/StoreDependencyMixin.js": 8,
      "./store/StoreDefinition.js": 10,
      "flowcheck/assert": 1
    } ],
    3: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * @flow weak
 **/
      var DispatcherInterface = _dereq_("./DispatcherInterface.js");
      var invariant = _dereq_("../invariant.js");
      var instance = null;
      var DispatcherInstance = {
        get: function() {
          var ret = function() {
            invariant(instance !== null, "DispatcherInstance.get: you haven't provide a dispatcher instance." + " You can pass an instance to" + " GeneralStore.define().register(dispatcher) or use" + " GeneralStore.DispatcherInstance.set(dispatcher) to set a global" + " instance." + " https://github.com/HubSpot/general-store#default-dispatcher-instance");
            return instance;
          }.apply(this, arguments);
          return _f.check(ret, Dispatcher);
        },
        set: function(dispatcher) {
          _f.check(arguments, _f.arguments([ Dispatcher ]));
          var ret = function(dispatcher) {
            invariant(DispatcherInterface.isDispatcher(dispatcher), "DispatcherInstance.set: Expected dispatcher to be an object" + ' with a register method, and an unregister method but got "%s".' + " Learn more about the dispatcher interface:" + " https://github.com/HubSpot/general-store#dispatcher-interface", dispatcher);
            instance = dispatcher;
          }.apply(this, arguments);
          return _f.check(ret, _f.void);
        }
      };
      module.exports = DispatcherInstance;
    }, {
      "../invariant.js": 7,
      "./DispatcherInterface.js": 4,
      "flowcheck/assert": 1
    } ],
    4: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /**
 * @flow
 */
      var DispatcherInterface = {
        isDispatcher: function(dispatcher) {
          _f.check(arguments, _f.arguments([ _f.object ]));
          var ret = function(dispatcher) {
            return typeof dispatcher === "object" && typeof dispatcher.register === "function" && typeof dispatcher.unregister === "function";
          }.apply(this, arguments);
          return _f.check(ret, _f.boolean);
        },
        isPayload: function(payload) {
          _f.check(arguments, _f.arguments([ _f.object ]));
          var ret = function(payload) {
            return payload !== null && typeof payload === "object" && typeof payload.actionType === "string" && payload.hasOwnProperty("data");
          }.apply(this, arguments);
          return _f.check(ret, _f.boolean);
        }
      };
      module.exports = DispatcherInterface;
    }, {
      "flowcheck/assert": 1
    } ],
    5: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
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
        _f.check(arguments, _f.arguments([ _f.function ]));
        var ret = function(callback) {
          var key = "" + uniqueID();
          this.$Event_handlers[key] = callback;
          return new EventHandler(this, key);
        }.apply(this, arguments);
        return _f.check(ret, EventHandler);
      };
      /**
   * Destroys this event. Removes all handlers.
   *
   * @return this
   */
      Event.prototype.remove = function() {
        "use strict";
        var ret = function() {
          this.$Event_handlers = {};
          return this;
        }.apply(this, arguments);
        return _f.check(ret, Event);
      };
      /**
   * Removes a subscription by key.
   *
   * @param  key   id of the subscription to remove
   * @return this
   */
      Event.prototype.removeHandler = function(key) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.string ]));
        var ret = function(key) {
          delete this.$Event_handlers[key];
          return this;
        }.apply(this, arguments);
        return _f.check(ret, Event);
      };
      /**
   * @protected
   * Run a handler by key if it exists
   *
   * @param  key  id of the handler to run
   */
      Event.prototype.$Event_runHandler = function(key) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.string ]));
        var ret = function(key) {
          if (this.$Event_handlers.hasOwnProperty(key)) {
            this.$Event_handlers[key].call();
          }
        }.apply(this, arguments);
        return _f.check(ret, _f.void);
      };
      /**
   * Run all subscribed handlers.
   *
   * @return this
   */
      Event.prototype.runHandlers = function() {
        "use strict";
        var ret = function() {
          Object.keys(this.$Event_handlers).forEach(this.$Event_runHandler.bind(this));
          return this;
        }.apply(this, arguments);
        return _f.check(ret, Event);
      };
      /**
 * Convenience method for running multiple events.
 *
 * @param  events  a list of events to run.
 */
      Event.runMultiple = function(events) {
        _f.check(arguments, _f.arguments([ _f.list(Event) ]));
        var ret = function(events) {
          events.forEach(function(evt) {
            return evt.runHandlers();
          });
        }.apply(this, arguments);
        return _f.check(ret, _f.void);
      };
      module.exports = Event;
    }, {
      "../uniqueid/uniqueID.js": 13,
      "./EventHandler.js": 6,
      "flowcheck/assert": 1
    } ],
    6: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /**
 * @flow
 */
      var EventManagerInterface = _f.shape({
        removeHandler: _f.function
      });
      function EventHandler(instance, key) {
        "use strict";
        _f.check(arguments, _f.arguments([ EventManagerInterface, _f.string ]));
        this.$EventHandler_key = key;
        this.$EventHandler_instance = instance;
      }
      EventHandler.prototype.remove = function() {
        "use strict";
        var ret = function() {
          if (this.$EventHandler_instance === null || this.$EventHandler_instance === undefined) {
            return;
          }
          this.$EventHandler_instance.removeHandler(this.$EventHandler_key);
          this.$EventHandler_instance = null;
        }.apply(this, arguments);
        return _f.check(ret, _f.void);
      };
      module.exports = EventHandler;
    }, {
      "flowcheck/assert": 1
    } ],
    7: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
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
      "use strict";
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
      var invariant = function(condition, format, a, b, c, d, e, f) {
        _f.check(arguments, _f.arguments([ _f.boolean, _f.string, _f.any, _f.any, _f.any, _f.any, _f.any, _f.any ]));
        var ret = function(condition, format, a, b, c, d, e, f) {
          if ("development" !== "production") {
            if (format === undefined) {
              throw new Error("invariant requires an error message argument");
            }
          }
          if (!condition) {
            var error;
            if ("development" !== "production") {
              var args = [ a, b, c, d, e, f ];
              var argIndex = 0;
              error = new Error("Invariant Violation: " + format.replace(/%s/g, function() {
                return args[argIndex++];
              }));
            } else {
              error = new Error("Minified exception occurred; use the non-minified dev environment " + "for the full error message and additional helpful warnings.");
            }
            throw error;
          }
        }.apply(this, arguments);
        return _f.check(ret, _f.void);
      };
      module.exports = invariant;
    }, {
      "flowcheck/assert": 1
    } ],
    8: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /**
 * @flow
 */
      var EventHandler = _dereq_("../event/EventHandler.js");
      var StoreDependencyDefinition = _dereq_("../store/StoreDependencyDefinition.js");
      var StoreFacade = _dereq_("../store/StoreFacade.js");
      function havePropsChanged(oldProps, nextProps) {
        _f.check(arguments, _f.arguments([ _f.object, _f.object ]));
        var ret = function(oldProps, nextProps) {
          return Object.keys(nextProps).some(function(key) {
            return oldProps[key] !== nextProps[key];
          });
        }.apply(this, arguments);
        return _f.check(ret, _f.boolean);
      }
      function hasStateChanged(stores, oldState, nextState) {
        _f.check(arguments, _f.arguments([ _f.object, _f.object, _f.object ]));
        var ret = function(stores, oldState, nextState) {
          return Object.keys(nextState).some(function(key) {
            return !stores.hasOwnProperty(key) && oldState[key] !== nextState[key];
          });
        }.apply(this, arguments);
        return _f.check(ret, _f.boolean);
      }
      function storeChangeCallback(component, dependencies, key) {
        _f.check(arguments, _f.arguments([ _f.object, StoreDependencyDefinition, _f.string ]));
        var ret = function(component, dependencies, key) {
          component.setState(dependencies.getStateField(key, component.props, component.state || {}));
        }.apply(this, arguments);
        return _f.check(ret, _f.void);
      }
      function StoreDependencyMixin(dependencyMap) {
        _f.check(arguments, _f.arguments([ _f.object ]));
        var ret = function(dependencyMap) {
          var dependencies = new StoreDependencyDefinition(dependencyMap);
          var hasCustomDerefs = Object.keys(dependencyMap).some(function(key) {
            return dependencyMap[key].deref;
          });
          return {
            componentWillMount: function() {
              var ret = function() {
                var i;
                var key;
                var store;
                var storeMap = dependencies.getStores();
                var stores;
                this._storeDependencyHandlers = [];
                for (key in storeMap) {
                  stores = storeMap[key];
                  for (i = 0; i < stores.length; i++) {
                    this._storeDependencyHandlers.push(stores[i].addOnChange(storeChangeCallback.bind(null, this, dependencies, key)));
                  }
                }
              }.apply(this, arguments);
              return _f.check(ret, _f.void);
            },
            componentWillUnmount: function() {
              var ret = function() {
                var handlers = this._storeDependencyHandlers;
                while (handlers.length) {
                  handlers.pop().remove();
                }
              }.apply(this, arguments);
              return _f.check(ret, _f.void);
            },
            componentWillUpdate: function(nextProps, nextState) {
              _f.check(arguments, _f.arguments([ _f.any, _f.any ]));
              var ret = function(nextProps, nextState) {
                if (!hasCustomDerefs) {
                  return;
                }
                if (!havePropsChanged(this.props, nextProps) && !hasStateChanged(dependencies.getStores(), this.state, nextState)) {
                  return;
                }
                this.setState(dependencies.getState(nextProps, nextState || {}));
              }.apply(this, arguments);
              return _f.check(ret, _f.void);
            },
            getInitialState: function() {
              var ret = function() {
                return dependencies.getState(this.props, this.state || {});
              }.apply(this, arguments);
              return _f.check(ret, _f.object);
            }
          };
        }.apply(this, arguments);
        return _f.check(ret, _f.object);
      }
      module.exports = StoreDependencyMixin;
    }, {
      "../event/EventHandler.js": 6,
      "../store/StoreDependencyDefinition.js": 11,
      "../store/StoreFacade.js": 12,
      "flowcheck/assert": 1
    } ],
    9: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /* @flow */
      var StoreConstants = {
        DEFAULT_GETTER_KEY: "DEFAULT_GETTER_KEY"
      };
      module.exports = StoreConstants;
    }, {
      "flowcheck/assert": 1
    } ],
    10: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /* @flow */
      var Dispatcher = _f.shape({
        register: _f.function,
        unregister: _f.function
      });
      var DispatcherInstance = _dereq_("../dispatcher/DispatcherInstance.js");
      var DispatcherInterface = _dereq_("../dispatcher/DispatcherInterface.js");
      var StoreConstants = _dereq_("./StoreConstants.js");
      var StoreFacade = _dereq_("./StoreFacade.js");
      var invariant = _dereq_("../invariant.js");
      function emptyGetter() {
        return null;
      }
      var HINT_LINK = "Learn more about defining stores:" + " https://github.com/HubSpot/general-store#create-a-store";
      function StoreDefinition() {
        "use strict";
        this.$StoreDefinition_facade = null;
        this.$StoreDefinition_getter = null;
        this.$StoreDefinition_responses = {};
      }
      StoreDefinition.prototype.defineGet = function(getter) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.function ]));
        var ret = function(getter) {
          invariant(!this.isRegistered(), "StoreDefinition.defineGet: this store definition cannot be modified" + " because is has already been registered with a dispatcher. %s", HINT_LINK);
          invariant(typeof getter === "function", "StoreDefinition.defineGet: expected getter to be a function but got" + ' "%s" instead. %s', getter, HINT_LINK);
          this.$StoreDefinition_getter = getter;
          return this;
        }.apply(this, arguments);
        return _f.check(ret, StoreDefinition);
      };
      StoreDefinition.prototype.defineResponseTo = function(actionType, response) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.string, _f.function ]));
        var ret = function(actionType, response) {
          invariant(!this.isRegistered(), "StoreDefinition.defineResponseTo: this store definition cannot be" + " modified because is has already been registered with a dispatcher. %s", HINT_LINK);
          invariant(typeof actionType === "string", "StoreDefinition.defineResponseTo: expected actionType to be a string" + ' but got "%s" instead. %s', actionType, HINT_LINK);
          invariant(!this.$StoreDefinition_responses.hasOwnProperty(actionType), "StoreDefinition.defineResponseTo: conflicting resposes for actionType" + ' "%s". Only one response can be defined per actionType per Store. %s', actionType, HINT_LINK);
          invariant(typeof response === "function", "StoreDefinition.defineResponseTo: expected response to be a function" + ' but got "%s" instead. %s', response);
          this.$StoreDefinition_responses[actionType] = response;
          return this;
        }.apply(this, arguments);
        return _f.check(ret, StoreDefinition);
      };
      StoreDefinition.prototype.isRegistered = function() {
        "use strict";
        var ret = function() {
          return this.$StoreDefinition_facade instanceof StoreFacade;
        }.apply(this, arguments);
        return _f.check(ret, _f.boolean);
      };
      StoreDefinition.prototype.register = function(dispatcher) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.maybe(Dispatcher) ]));
        var ret = function(dispatcher) {
          invariant(!dispatcher || DispatcherInterface.isDispatcher(dispatcher), "StoreDefinition.register: Expected dispatcher to be an object" + ' with a register method, and an unregister method but got "%s".' + " Learn more about the dispatcher interface:" + " https://github.com/HubSpot/general-store#dispatcher-interface", dispatcher);
          invariant(typeof this.$StoreDefinition_getter === "function", "StoreDefinition.register: a store cannot be registered without a" + " getter. Use GeneralStore.define().defineGet(getter) to define a" + " getter. %s", HINT_LINK);
          var facade = this.$StoreDefinition_facade || new StoreFacade(this.$StoreDefinition_getter || emptyGetter, this.$StoreDefinition_responses, dispatcher || DispatcherInstance.get());
          if (this.$StoreDefinition_facade === null) {
            this.$StoreDefinition_facade = facade;
          }
          return facade;
        }.apply(this, arguments);
        return _f.check(ret, StoreFacade);
      };
      module.exports = StoreDefinition;
    }, {
      "../dispatcher/DispatcherInstance.js": 3,
      "../dispatcher/DispatcherInterface.js": 4,
      "../invariant.js": 7,
      "./StoreConstants.js": 9,
      "./StoreFacade.js": 12,
      "flowcheck/assert": 1
    } ],
    11: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /**
 * @flow
 */
      var StoreFacade = _dereq_("./StoreFacade.js");
      var invariant = _dereq_("../invariant.js");
      var HINT_LINK = "Learn more about defining fields with the StoreDependencyMixin:" + " https://github.com/HubSpot/general-store#react";
      var derefingFunction = _f.function;
      var CompoundStoreDependency = _f.shape({
        stores: _f.list(StoreFacade),
        deref: derefingFunction
      });
      var StoreDependencies = _f.dict(_f.string, _f.union([ StoreFacade, CompoundStoreDependency ]));
      function defaultDeref(_, _, stores) {
        _f.check(arguments, _f.arguments([ _f.any, _f.any, _f.list(StoreFacade) ]));
        var ret = function(_, _, stores) {
          return stores[0].get();
        }.apply(this, arguments);
        return _f.check(ret, _f.any);
      }
      function extractDeref(dependencies, field) {
        _f.check(arguments, _f.arguments([ StoreDependencies, _f.string ]));
        var ret = function(dependencies, field) {
          var dependency = dependencies[field];
          if (dependency instanceof StoreFacade) {
            return defaultDeref;
          }
          invariant(typeof dependency.deref === "function", 'StoreDependencyDefinition: the compound field "%s" does not have' + " a `deref` function. Provide one, or make it a simple field instead. %s", field, HINT_LINK);
          return dependency.deref;
        }.apply(this, arguments);
        return _f.check(ret, derefingFunction);
      }
      function extractStores(dependencies, field) {
        _f.check(arguments, _f.arguments([ StoreDependencies, _f.string ]));
        var ret = function(dependencies, field) {
          var dependency = dependencies[field];
          if (dependency instanceof StoreFacade) {
            return [ dependency ];
          }
          invariant(Array.isArray(dependency.stores) && dependency.stores.length, "StoreDependencyDefinition: the `stores` property on the compound field" + ' "%s" must be an array of Stores with at least one Store. %s', HINT_LINK);
          return dependency.stores;
        }.apply(this, arguments);
        return _f.check(ret, _f.list(StoreFacade));
      }
      function StoreDependencyDefinition(dependencyMap) {
        "use strict";
        _f.check(arguments, _f.arguments([ StoreDependencies ]));
        this.$StoreDependencyDefinition_derefs = {};
        this.$StoreDependencyDefinition_stores = {};
        var dependency;
        for (var field in dependencyMap) {
          dependency = dependencyMap[field];
          this.$StoreDependencyDefinition_derefs[field] = extractDeref(dependencyMap, field);
          this.$StoreDependencyDefinition_stores[field] = extractStores(dependencyMap, field);
        }
      }
      StoreDependencyDefinition.prototype.$StoreDependencyDefinition_derefStore = function(field, props, state) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.string, _f.object, _f.object ]));
        var ret = function(field, props, state) {
          return this.$StoreDependencyDefinition_derefs[field](props, state, this.$StoreDependencyDefinition_stores[field]);
        }.apply(this, arguments);
        return _f.check(ret, _f.any);
      };
      StoreDependencyDefinition.prototype.getState = function(props, state) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.object, _f.object ]));
        var ret = function(props, state) {
          var updates = {};
          for (var field in this.$StoreDependencyDefinition_stores) {
            updates[field] = this.$StoreDependencyDefinition_derefStore(field, props, state);
          }
          return updates;
        }.apply(this, arguments);
        return _f.check(ret, _f.object);
      };
      StoreDependencyDefinition.prototype.getStateField = function(field, props, state) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.string, _f.object, _f.object ]));
        var ret = function(field, props, state) {
          var update = {};
          update[field] = this.$StoreDependencyDefinition_derefStore(field, props, state);
          return update;
        }.apply(this, arguments);
        return _f.check(ret, _f.object);
      };
      StoreDependencyDefinition.prototype.getStores = function() {
        "use strict";
        var ret = function() {
          return this.$StoreDependencyDefinition_stores;
        }.apply(this, arguments);
        return _f.check(ret, _f.dict(_f.string, _f.list(StoreFacade)));
      };
      module.exports = StoreDependencyDefinition;
    }, {
      "../invariant.js": 7,
      "./StoreFacade.js": 12,
      "flowcheck/assert": 1
    } ],
    12: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /* @flow */
      var DispatcherInterface = _dereq_("../dispatcher/DispatcherInterface.js");
      var Event = _dereq_("../event/Event.js");
      var EventHandler = _dereq_("../event/EventHandler.js");
      var StoreConstants = _dereq_("./StoreConstants.js");
      var invariant = _dereq_("../invariant.js");
      var HINT_LINK = "Learn more about using the Store API:" + " https://github.com/HubSpot/general-store#using-the-store-api";
      function getNull() {
        return null;
      }
      function StoreFacade(getter, responses, dispatcher) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.function, _f.dict(_f.string, _f.function), _f.object ]));
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
        _f.check(arguments, _f.arguments([ _f.function ]));
        var ret = function(callback) {
          invariant(typeof callback === "function", "StoreFacade.addOnChange: expected callback to be a function" + ' but got "%s" instead. %s', callback, HINT_LINK);
          return this.$StoreFacade_event.addHandler(callback);
        }.apply(this, arguments);
        return _f.check(ret, EventHandler);
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
        _f.check(arguments, _f.arguments([], _f.list(_f.any)));
        var ret = function() {
          return this.$StoreFacade_getter.apply(null, args);
        }.apply(this, arguments);
        return _f.check(ret, _f.any);
      };
      /**
   * Exposes the store's dispatcher instance.
   *
   * @return Dispatcher
   */
      StoreFacade.prototype.getDispatcher = function() {
        "use strict";
        var ret = function() {
          return this.$StoreFacade_dispatcher;
        }.apply(this, arguments);
        return _f.check(ret, _f.object);
      };
      /**
   * Exposes the token assigned to the store by the dispatcher
   *
   * @return number
   */
      StoreFacade.prototype.getDispatchToken = function() {
        "use strict";
        var ret = function() {
          return this.$StoreFacade_dispatchToken;
        }.apply(this, arguments);
        return _f.check(ret, _f.number);
      };
      /**
   * @protected
   * Responds to incoming messages from the Dispatcher
   */
      StoreFacade.prototype.$StoreFacade_handleDispatch = function(payload) {
        "use strict";
        _f.check(arguments, _f.arguments([ _f.shape({
          actionType: _f.string,
          data: _f.any
        }) ]));
        var ret = function(payload) {
          invariant(DispatcherInterface.isPayload(payload), "StoreFacade: expected dispatched payload to be an object with a property" + ' "actionType" containing a string and a property "data" containing any value' + ' but got "%s" instead. Learn more about the dispatcher interface:' + " https://github.com/HubSpot/general-store#dispatcher-interface");
          if (!this.$StoreFacade_responses.hasOwnProperty(payload.actionType)) {
            return;
          }
          this.$StoreFacade_responses[payload.actionType](payload.data, payload.actionType);
          this.triggerChange();
        }.apply(this, arguments);
        return _f.check(ret, _f.void);
      };
      /**
   * Destroys this instance of the store.
   * Dispatch callback is unregistered. Subscriptions are removed.
   */
      StoreFacade.prototype.remove = function() {
        "use strict";
        var ret = function() {
          this.$StoreFacade_dispatcher.unregister(this.getDispatchToken());
          this.$StoreFacade_event.remove();
          this.$StoreFacade_getter = getNull;
          this.$StoreFacade_responses = {};
        }.apply(this, arguments);
        return _f.check(ret, _f.void);
      };
      /**
   * Runs all of the store's subscription callbacks
   *
   * @return this
   */
      StoreFacade.prototype.triggerChange = function() {
        "use strict";
        var ret = function() {
          this.$StoreFacade_event.runHandlers();
          return this;
        }.apply(this, arguments);
        return _f.check(ret, StoreFacade);
      };
      module.exports = StoreFacade;
    }, {
      "../dispatcher/DispatcherInterface.js": 4,
      "../event/Event.js": 5,
      "../event/EventHandler.js": 6,
      "../invariant.js": 7,
      "./StoreConstants.js": 9,
      "flowcheck/assert": 1
    } ],
    13: [ function(_dereq_, module, exports) {
      var _f = _dereq_("flowcheck/assert");
      /**
 * @flow
 */
      var nextUid = 0;
      function uid() {
        var ret = function() {
          return nextUid++;
        }.apply(this, arguments);
        return _f.check(ret, _f.number);
      }
      module.exports = uid;
    }, {
      "flowcheck/assert": 1
    } ]
  }, {}, [ 2 ])(2);
});