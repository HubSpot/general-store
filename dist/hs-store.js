(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* @flow */

function composeError(args            )        {
  return Error(
    args.join(' ')
  );
}

var PrimitiveTypeHints = {

  enforceIsFunction:function(arg     , scope        )       {
    if (typeof arg !== 'function') {
      throw composeError([
        scope,
        ': expected a function but got "',
        arg,
        '" instead.'
      ]);
    }
  },

  enforceIsString:function(
    arg     ,
    scope        
  )       {
    if (typeof arg !== 'string') {
      throw composeError([
        scope,
        ': expected a string but got "',
        arg,
        '" instead.'
      ]);
    }
  },

  enforceUniqueKey:function(
    context        ,
    key        ,
    scope        
  )       {
    if (context.hasOwnProperty(key)) {
      throw composeError([
        scope,
        ': "',
        key,
        '" is already defined'
      ]);
    }
  }

};

module.exports = PrimitiveTypeHints;

},{}],2:[function(require,module,exports){
/* @flow */

var StoreDefinition = require('./store/StoreDefinition.js');

var HSStore = {

  define:function()                  {
    return new StoreDefinition();
  }

};

module.exports = HSStore;

},{"./store/StoreDefinition.js":4}],3:[function(require,module,exports){
/* @flow */

var StoreConstants = {
  DEFAULT_GETTER_KEY: 'DEFAULT_GETTER_KEY'
};

module.exports = StoreConstants;

},{}],4:[function(require,module,exports){
/* @flow */

var StoreConstants = require('./StoreConstants.js');
var StoreFacade = require('./StoreFacade.js');

var $__0=
  
  
  
  require('../hints/PrimitiveTypeHints.js'),enforceIsFunction=$__0.enforceIsFunction,enforceIsString=$__0.enforceIsString,enforceUniqueKey=$__0.enforceUniqueKey;

var SCOPE_HINT = 'StoreDefinition';



                        
                                       
                                                   

  function StoreDefinition() {"use strict";
    this.$StoreDefinition_facade = null;
    this.$StoreDefinition_getters = {}
    this.$StoreDefinition_responses = {};
  }

  StoreDefinition.prototype.defineGet=function(
getter)          
                    {"use strict";
    enforceUniqueKey(
      this.$StoreDefinition_getters,
      StoreConstants.DEFAULT_GETTER_KEY,
      SCOPE_HINT
    );
    return this.defineGetKey(
      StoreConstants.DEFAULT_GETTER_KEY,
      getter
    );
  };

  StoreDefinition.prototype.defineGetKey=function(
key        ,
    getter)           
                    {"use strict";
    enforceIsString(key, SCOPE_HINT);
    enforceIsFunction(getter, SCOPE_HINT);
    enforceUniqueKey(this.$StoreDefinition_getters, key, SCOPE_HINT);
    this.$StoreDefinition_enforceUnregistered();
    this.$StoreDefinition_getters[key] = getter;
    return this;
  };

  StoreDefinition.prototype.defineResponseTo=function(
actionType        ,
    response)                     
                    {"use strict";
    
    enforceIsString(actionType, SCOPE_HINT);
    enforceIsFunction(response, SCOPE_HINT);
    this.$StoreDefinition_responses[actionType] = response;
    return this;
  };

  StoreDefinition.prototype.$StoreDefinition_enforceUnregistered=function()       {"use strict";
    if (this.$StoreDefinition_facade !== null) {
      throw new Error(
        SCOPE_HINT +
        ': a store definition cannot be modified after it is registered'
      );
    }
  };

  StoreDefinition.prototype.register=function(
dispatcher)        
                {"use strict";
    if (this.$StoreDefinition_facade) {
      this.$StoreDefinition_facade = new StoreFacade(
        this.$StoreDefinition_getters,
        this.$StoreDefinition_responses,
        dispatcher
      );
    }
    return this.$StoreDefinition_facade;
  };



module.exports = StoreDefinition;

},{"../hints/PrimitiveTypeHints.js":1,"./StoreConstants.js":3,"./StoreFacade.js":5}],5:[function(require,module,exports){

function StoreFacade(){"use strict";}



module.exports = StoreFacade;

},{}]},{},[2]);
