(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/* @flow */

function composeError(args            )        {
  return new Error(args.join(' '));
}

                   
                                                            
 

var TypeHints = {

  enforceDispatcherInterface:function(
    dispatcher            ,
    scope        
  )       {
    if (
      typeof dispatcher !== 'object' ||
      typeof dispatcher.register !== 'function'
    ) {
      throw composeError([
        scope,
        ': expected an object with a register method but got "',
        dispatcher,
        '" instead.'
      ]);
    }
  },

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

  enforceKeyIsDefined:function(
    context        ,
    key        ,
    scope        
  )       {
    if (!context.hasOwnProperty(key)) {
      throw composeError([
        scope,
        ': "',
        key,
        '" is not defined.'
      ]);
    }
  },

  enforceKeyIsNotDefined:function(
    context        ,
    key        ,
    scope        
  )       {
    if (context.hasOwnProperty(key)) {
      throw composeError([
        scope,
        ': "',
        key,
        '" is already defined.'
      ]);
    }
  }

};

module.exports = TypeHints;

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
  
  
  
  
  require('../core/hints/TypeHints.js'),enforceDispatcherInterface=$__0.enforceDispatcherInterface,enforceIsFunction=$__0.enforceIsFunction,enforceIsString=$__0.enforceIsString,enforceKeyIsNotDefined=$__0.enforceKeyIsNotDefined;

var SCOPE_HINT = 'StoreDefinition';

function emptyGetter() {
  return null;
}



                        
                     
                                                   

  function StoreDefinition() {"use strict";
    this.$StoreDefinition_facade = null;
    this.$StoreDefinition_getter = null;
    this.$StoreDefinition_responses = {};
  }

  StoreDefinition.prototype.defineGet=function(
getter)          
                    {"use strict";
    enforceIsFunction(getter, SCOPE_HINT);
    this.$StoreDefinition_enforceIsUnregistered();
    this.$StoreDefinition_getter = getter;
    return this;
  };

  StoreDefinition.prototype.defineResponseTo=function(
actionType        ,
    response)                     
                    {"use strict";
    enforceIsString(actionType, SCOPE_HINT);
    enforceIsFunction(response, SCOPE_HINT);
    enforceKeyIsNotDefined(this.$StoreDefinition_responses, actionType, SCOPE_HINT);
    this.$StoreDefinition_enforceIsUnregistered();
    this.$StoreDefinition_responses[actionType] = response;
    return this;
  };

  StoreDefinition.prototype.$StoreDefinition_enforceIsReadyForRegistration=function()       {"use strict";
    if (typeof this.$StoreDefinition_getter !== 'function') {
      throw new Error(
        SCOPE_HINT +
        ': you must call defineGet before calling register.'
      );
    }
  };

  StoreDefinition.prototype.$StoreDefinition_enforceIsUnregistered=function()       {"use strict";
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
    enforceDispatcherInterface(dispatcher, SCOPE_HINT);
    this.$StoreDefinition_enforceIsReadyForRegistration();
    var facade =
      this.$StoreDefinition_facade || new StoreFacade(
        this.$StoreDefinition_getter || emptyGetter,
        this.$StoreDefinition_responses,
        dispatcher
      );
    if (this.$StoreDefinition_facade === null) {
      this.$StoreDefinition_facade = facade;
    }
    return facade;
  };



module.exports = StoreDefinition;

},{"../core/hints/TypeHints.js":1,"./StoreConstants.js":3,"./StoreFacade.js":5}],5:[function(require,module,exports){
/* @flow */
var StoreConstants = require('./StoreConstants.js');

var $__0=
  
  
  require('../core/hints/TypeHints.js'),enforceKeyIsDefined=$__0.enforceKeyIsDefined,enforceIsFunction=$__0.enforceIsFunction;

var SCOPE_HINT = 'StoreFacade';



                      
                         
                                        
                              
                                                                     

  function StoreFacade(
getter                              ,
    responses                                                        ,
    dispatcher)        
   {"use strict";
    this.$StoreFacade_dispatcher = dispatcher;
    this.$StoreFacade_getter = getter;
    this.$StoreFacade_responses = responses;
    this.$StoreFacade_listeners = [];

    this.$StoreFacade_dispatchToken =
      this.$StoreFacade_dispatcher
        .register(function(data)  {return this.$StoreFacade_handleDispatch(data);}.bind(this));
  }

  StoreFacade.prototype.addOnChange=function(callback)                        {"use strict";
    enforceIsFunction(callback, SCOPE_HINT);
    this.$StoreFacade_listeners.push(callback);
    return this;
  };

  StoreFacade.prototype.get=function()                  {"use strict";for (var args=[],$__0=0,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    return this.$StoreFacade_getter.apply(null, args);
  };

  StoreFacade.prototype.getDispatcher=function()         {"use strict";
    return this.$StoreFacade_dispatcher;
  };

  StoreFacade.prototype.getDispatchToken=function()         {"use strict";
    return this.$StoreFacade_dispatchToken;
  };

  StoreFacade.prototype.$StoreFacade_handleDispatch=function(
$__0 )                                 
         {"use strict";var actionType=$__0.actionType,data=$__0.data;
    if (!this.$StoreFacade_responses.hasOwnProperty(actionType)) {
      return;
    }
    this.$StoreFacade_responses[actionType](data, actionType);
    this.triggerChange();
  };

  StoreFacade.prototype.removeOnChange=function(callback)                        {"use strict";
    var index = this.$StoreFacade_listeners.indexOf(callback);
    if (index !== -1) {
      this.$StoreFacade_listeners.splice(index, 1);
    }
    return this;
  };

  StoreFacade.prototype.triggerChange=function()              {"use strict";
    this.$StoreFacade_listeners.forEach(function(listener)  {return listener.call();});
    return this;
  };



module.exports = StoreFacade;

},{"../core/hints/TypeHints.js":1,"./StoreConstants.js":3}]},{},[2]);
