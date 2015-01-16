(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/crabideau/Desktop/hs-store/src/hints/PrimitiveTypeHints.js":[function(require,module,exports){
/* @flow */

function composeError(args            )        {
  return new Error(args.join(' '));
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

module.exports = PrimitiveTypeHints;

},{}],"/Users/crabideau/Desktop/hs-store/src/index.js":[function(require,module,exports){
/* @flow */

var StoreDefinition = require('./store/StoreDefinition.js');

var HSStore = {

  define:function()                  {
    return new StoreDefinition();
  }

};

module.exports = HSStore;

},{"./store/StoreDefinition.js":"/Users/crabideau/Desktop/hs-store/src/store/StoreDefinition.js"}],"/Users/crabideau/Desktop/hs-store/src/store/StoreConstants.js":[function(require,module,exports){
/* @flow */

var StoreConstants = {
  DEFAULT_GETTER_KEY: 'DEFAULT_GETTER_KEY'
};

module.exports = StoreConstants;

},{}],"/Users/crabideau/Desktop/hs-store/src/store/StoreDefinition.js":[function(require,module,exports){
/* @flow */

var StoreConstants = require('./StoreConstants.js');
var StoreFacade = require('./StoreFacade.js');

var $__0=
  
  
  
  require('../hints/PrimitiveTypeHints.js'),enforceIsFunction=$__0.enforceIsFunction,enforceIsString=$__0.enforceIsString,enforceKeyIsNotDefined=$__0.enforceKeyIsNotDefined;

var SCOPE_HINT = 'StoreDefinition';



                        
                                       
                                                   

  function StoreDefinition() {"use strict";
    this.$StoreDefinition_facade = null;
    this.$StoreDefinition_getters = {}
    this.$StoreDefinition_responses = {};
  }

  StoreDefinition.prototype.defineGet=function(
getter)          
                    {"use strict";
    enforceKeyIsNotDefined(
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
    enforceKeyIsNotDefined(this.$StoreDefinition_getters, key, SCOPE_HINT);
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
    var facade =
      this.$StoreDefinition_facade || new StoreFacade(
        this.$StoreDefinition_getters,
        this.$StoreDefinition_responses,
        dispatcher
      );
    if (this.$StoreDefinition_facade === null) {
      this.$StoreDefinition_facade = facade;
    }
    return facade;
  };



module.exports = StoreDefinition;

},{"../hints/PrimitiveTypeHints.js":"/Users/crabideau/Desktop/hs-store/src/hints/PrimitiveTypeHints.js","./StoreConstants.js":"/Users/crabideau/Desktop/hs-store/src/store/StoreConstants.js","./StoreFacade.js":"/Users/crabideau/Desktop/hs-store/src/store/StoreFacade.js"}],"/Users/crabideau/Desktop/hs-store/src/store/StoreFacade.js":[function(require,module,exports){
/* @flow */
var StoreConstants = require('./StoreConstants.js');

var $__0=
  
  
  require('../hints/PrimitiveTypeHints.js'),enforceKeyIsDefined=$__0.enforceKeyIsDefined,enforceIsFunction=$__0.enforceIsFunction;

var SCOPE_HINT = 'StoreFacade';



                      
                         
                                                         
                              
                                                                     

  function StoreFacade(
getters                                              ,
    responses                                                        ,
    dispatcher)        
   {"use strict";
    this.$StoreFacade_dispatcher = dispatcher;
    this.$StoreFacade_getters = getters;
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
    var get = this.getKey.bind(
      this,
      StoreConstants.DEFAULT_GETTER_KEY
    );
    return get.apply(null, args);
  };

  StoreFacade.prototype.getKey=function(key)                           {"use strict";for (var args=[],$__0=1,$__1=arguments.length;$__0<$__1;$__0++) args.push(arguments[$__0]);
    enforceKeyIsDefined(this.$StoreFacade_getters, key, SCOPE_HINT);
    return this.$StoreFacade_getters[key].apply(null, args);
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
    enforceKeyIsDefined(this.$StoreFacade_responses, actionType, SCOPE_HINT);
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

  StoreFacade.prototype.waitFor=function()              {"use strict";
    this.$StoreFacade_dispatcher.waitFor(
      this.getDispatchToken()
    );
    return this;
  };



module.exports = StoreFacade;

},{"../hints/PrimitiveTypeHints.js":"/Users/crabideau/Desktop/hs-store/src/hints/PrimitiveTypeHints.js","./StoreConstants.js":"/Users/crabideau/Desktop/hs-store/src/store/StoreConstants.js"}]},{},["/Users/crabideau/Desktop/hs-store/src/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL29wdC9ib3hlbi9ub2RlbnYvdmVyc2lvbnMvdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2hpbnRzL1ByaW1pdGl2ZVR5cGVIaW50cy5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9zdG9yZS9TdG9yZUNvbnN0YW50cy5qcyIsInNyYy9zdG9yZS9TdG9yZURlZmluaXRpb24uanMiLCJzcmMvc3RvcmUvU3RvcmVGYWNhZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBAZmxvdyAqL1xuXG5mdW5jdGlvbiBjb21wb3NlRXJyb3IoYXJncyAgICAgICAgICAgICkgICAgICAgIHtcbiAgcmV0dXJuIG5ldyBFcnJvcihhcmdzLmpvaW4oJyAnKSk7XG59XG5cbnZhciBQcmltaXRpdmVUeXBlSGludHMgPSB7XG5cbiAgZW5mb3JjZUlzRnVuY3Rpb246ZnVuY3Rpb24oYXJnICAgICAsIHNjb3BlICAgICAgICApICAgICAgIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgY29tcG9zZUVycm9yKFtcbiAgICAgICAgc2NvcGUsXG4gICAgICAgICc6IGV4cGVjdGVkIGEgZnVuY3Rpb24gYnV0IGdvdCBcIicsXG4gICAgICAgIGFyZyxcbiAgICAgICAgJ1wiIGluc3RlYWQuJ1xuICAgICAgXSk7XG4gICAgfVxuICB9LFxuXG4gIGVuZm9yY2VJc1N0cmluZzpmdW5jdGlvbihcbiAgICBhcmcgICAgICxcbiAgICBzY29wZSAgICAgICAgXG4gICkgICAgICAge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgY29tcG9zZUVycm9yKFtcbiAgICAgICAgc2NvcGUsXG4gICAgICAgICc6IGV4cGVjdGVkIGEgc3RyaW5nIGJ1dCBnb3QgXCInLFxuICAgICAgICBhcmcsXG4gICAgICAgICdcIiBpbnN0ZWFkLidcbiAgICAgIF0pO1xuICAgIH1cbiAgfSxcblxuICBlbmZvcmNlS2V5SXNEZWZpbmVkOmZ1bmN0aW9uKFxuICAgIGNvbnRleHQgICAgICAgICxcbiAgICBrZXkgICAgICAgICxcbiAgICBzY29wZSAgICAgICAgXG4gICkgICAgICAge1xuICAgIGlmICghY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0aHJvdyBjb21wb3NlRXJyb3IoW1xuICAgICAgICBzY29wZSxcbiAgICAgICAgJzogXCInLFxuICAgICAgICBrZXksXG4gICAgICAgICdcIiBpcyBub3QgZGVmaW5lZC4nXG4gICAgICBdKTtcbiAgICB9XG4gIH0sXG5cbiAgZW5mb3JjZUtleUlzTm90RGVmaW5lZDpmdW5jdGlvbihcbiAgICBjb250ZXh0ICAgICAgICAsXG4gICAga2V5ICAgICAgICAsXG4gICAgc2NvcGUgICAgICAgIFxuICApICAgICAgIHtcbiAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0aHJvdyBjb21wb3NlRXJyb3IoW1xuICAgICAgICBzY29wZSxcbiAgICAgICAgJzogXCInLFxuICAgICAgICBrZXksXG4gICAgICAgICdcIiBpcyBhbHJlYWR5IGRlZmluZWQuJ1xuICAgICAgXSk7XG4gICAgfVxuICB9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUHJpbWl0aXZlVHlwZUhpbnRzO1xuIiwiLyogQGZsb3cgKi9cblxudmFyIFN0b3JlRGVmaW5pdGlvbiA9IHJlcXVpcmUoJy4vc3RvcmUvU3RvcmVEZWZpbml0aW9uLmpzJyk7XG5cbnZhciBIU1N0b3JlID0ge1xuXG4gIGRlZmluZTpmdW5jdGlvbigpICAgICAgICAgICAgICAgICAge1xuICAgIHJldHVybiBuZXcgU3RvcmVEZWZpbml0aW9uKCk7XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBIU1N0b3JlO1xuIiwiLyogQGZsb3cgKi9cblxudmFyIFN0b3JlQ29uc3RhbnRzID0ge1xuICBERUZBVUxUX0dFVFRFUl9LRVk6ICdERUZBVUxUX0dFVFRFUl9LRVknXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlQ29uc3RhbnRzO1xuIiwiLyogQGZsb3cgKi9cblxudmFyIFN0b3JlQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9TdG9yZUNvbnN0YW50cy5qcycpO1xudmFyIFN0b3JlRmFjYWRlID0gcmVxdWlyZSgnLi9TdG9yZUZhY2FkZS5qcycpO1xuXG52YXIgJF9fMD1cbiAgXG4gIFxuICBcbiAgcmVxdWlyZSgnLi4vaGludHMvUHJpbWl0aXZlVHlwZUhpbnRzLmpzJyksZW5mb3JjZUlzRnVuY3Rpb249JF9fMC5lbmZvcmNlSXNGdW5jdGlvbixlbmZvcmNlSXNTdHJpbmc9JF9fMC5lbmZvcmNlSXNTdHJpbmcsZW5mb3JjZUtleUlzTm90RGVmaW5lZD0kX18wLmVuZm9yY2VLZXlJc05vdERlZmluZWQ7XG5cbnZhciBTQ09QRV9ISU5UID0gJ1N0b3JlRGVmaW5pdGlvbic7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgZnVuY3Rpb24gU3RvcmVEZWZpbml0aW9uKCkge1widXNlIHN0cmljdFwiO1xuICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9mYWNhZGUgPSBudWxsO1xuICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9nZXR0ZXJzID0ge31cbiAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fcmVzcG9uc2VzID0ge307XG4gIH1cblxuICBTdG9yZURlZmluaXRpb24ucHJvdG90eXBlLmRlZmluZUdldD1mdW5jdGlvbihcbmdldHRlcikgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICBlbmZvcmNlS2V5SXNOb3REZWZpbmVkKFxuICAgICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2dldHRlcnMsXG4gICAgICBTdG9yZUNvbnN0YW50cy5ERUZBVUxUX0dFVFRFUl9LRVksXG4gICAgICBTQ09QRV9ISU5UXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcy5kZWZpbmVHZXRLZXkoXG4gICAgICBTdG9yZUNvbnN0YW50cy5ERUZBVUxUX0dFVFRFUl9LRVksXG4gICAgICBnZXR0ZXJcbiAgICApO1xuICB9O1xuXG4gIFN0b3JlRGVmaW5pdGlvbi5wcm90b3R5cGUuZGVmaW5lR2V0S2V5PWZ1bmN0aW9uKFxua2V5ICAgICAgICAsXG4gICAgZ2V0dGVyKSAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICBlbmZvcmNlSXNTdHJpbmcoa2V5LCBTQ09QRV9ISU5UKTtcbiAgICBlbmZvcmNlSXNGdW5jdGlvbihnZXR0ZXIsIFNDT1BFX0hJTlQpO1xuICAgIGVuZm9yY2VLZXlJc05vdERlZmluZWQodGhpcy4kU3RvcmVEZWZpbml0aW9uX2dldHRlcnMsIGtleSwgU0NPUEVfSElOVCk7XG4gICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2VuZm9yY2VVbnJlZ2lzdGVyZWQoKTtcbiAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZ2V0dGVyc1trZXldID0gZ2V0dGVyO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFN0b3JlRGVmaW5pdGlvbi5wcm90b3R5cGUuZGVmaW5lUmVzcG9uc2VUbz1mdW5jdGlvbihcbmFjdGlvblR5cGUgICAgICAgICxcbiAgICByZXNwb25zZSkgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIFxuICAgIGVuZm9yY2VJc1N0cmluZyhhY3Rpb25UeXBlLCBTQ09QRV9ISU5UKTtcbiAgICBlbmZvcmNlSXNGdW5jdGlvbihyZXNwb25zZSwgU0NPUEVfSElOVCk7XG4gICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX3Jlc3BvbnNlc1thY3Rpb25UeXBlXSA9IHJlc3BvbnNlO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFN0b3JlRGVmaW5pdGlvbi5wcm90b3R5cGUuJFN0b3JlRGVmaW5pdGlvbl9lbmZvcmNlVW5yZWdpc3RlcmVkPWZ1bmN0aW9uKCkgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLiRTdG9yZURlZmluaXRpb25fZmFjYWRlICE9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgIFNDT1BFX0hJTlQgK1xuICAgICAgICAnOiBhIHN0b3JlIGRlZmluaXRpb24gY2Fubm90IGJlIG1vZGlmaWVkIGFmdGVyIGl0IGlzIHJlZ2lzdGVyZWQnXG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBTdG9yZURlZmluaXRpb24ucHJvdG90eXBlLnJlZ2lzdGVyPWZ1bmN0aW9uKFxuZGlzcGF0Y2hlcikgICAgICAgIFxuICAgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgZmFjYWRlID1cbiAgICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9mYWNhZGUgfHwgbmV3IFN0b3JlRmFjYWRlKFxuICAgICAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZ2V0dGVycyxcbiAgICAgICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX3Jlc3BvbnNlcyxcbiAgICAgICAgZGlzcGF0Y2hlclxuICAgICAgKTtcbiAgICBpZiAodGhpcy4kU3RvcmVEZWZpbml0aW9uX2ZhY2FkZSA9PT0gbnVsbCkge1xuICAgICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2ZhY2FkZSA9IGZhY2FkZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhY2FkZTtcbiAgfTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmVEZWZpbml0aW9uO1xuIiwiLyogQGZsb3cgKi9cbnZhciBTdG9yZUNvbnN0YW50cyA9IHJlcXVpcmUoJy4vU3RvcmVDb25zdGFudHMuanMnKTtcblxudmFyICRfXzA9XG4gIFxuICBcbiAgcmVxdWlyZSgnLi4vaGludHMvUHJpbWl0aXZlVHlwZUhpbnRzLmpzJyksZW5mb3JjZUtleUlzRGVmaW5lZD0kX18wLmVuZm9yY2VLZXlJc0RlZmluZWQsZW5mb3JjZUlzRnVuY3Rpb249JF9fMC5lbmZvcmNlSXNGdW5jdGlvbjtcblxudmFyIFNDT1BFX0hJTlQgPSAnU3RvcmVGYWNhZGUnO1xuXG5cblxuICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuXG4gIGZ1bmN0aW9uIFN0b3JlRmFjYWRlKFxuZ2V0dGVycyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXG4gICAgcmVzcG9uc2VzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAsXG4gICAgZGlzcGF0Y2hlcikgICAgICAgIFxuICAge1widXNlIHN0cmljdFwiO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX2Rpc3BhdGNoZXIgPSBkaXNwYXRjaGVyO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX2dldHRlcnMgPSBnZXR0ZXJzO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX3Jlc3BvbnNlcyA9IHJlc3BvbnNlcztcbiAgICB0aGlzLiRTdG9yZUZhY2FkZV9saXN0ZW5lcnMgPSBbXTtcblxuICAgIHRoaXMuJFN0b3JlRmFjYWRlX2Rpc3BhdGNoVG9rZW4gPVxuICAgICAgdGhpcy4kU3RvcmVGYWNhZGVfZGlzcGF0Y2hlclxuICAgICAgICAucmVnaXN0ZXIoZnVuY3Rpb24oZGF0YSkgIHtyZXR1cm4gdGhpcy4kU3RvcmVGYWNhZGVfaGFuZGxlRGlzcGF0Y2goZGF0YSk7fS5iaW5kKHRoaXMpKTtcbiAgfVxuXG4gIFN0b3JlRmFjYWRlLnByb3RvdHlwZS5hZGRPbkNoYW5nZT1mdW5jdGlvbihjYWxsYmFjaykgICAgICAgICAgICAgICAgICAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgZW5mb3JjZUlzRnVuY3Rpb24oY2FsbGJhY2ssIFNDT1BFX0hJTlQpO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX2xpc3RlbmVycy5wdXNoKGNhbGxiYWNrKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTdG9yZUZhY2FkZS5wcm90b3R5cGUuZ2V0PWZ1bmN0aW9uKCkgICAgICAgICAgICAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7Zm9yICh2YXIgYXJncz1bXSwkX18wPTAsJF9fMT1hcmd1bWVudHMubGVuZ3RoOyRfXzA8JF9fMTskX18wKyspIGFyZ3MucHVzaChhcmd1bWVudHNbJF9fMF0pO1xuICAgIHZhciBnZXQgPSB0aGlzLmdldEtleS5iaW5kKFxuICAgICAgdGhpcyxcbiAgICAgIFN0b3JlQ29uc3RhbnRzLkRFRkFVTFRfR0VUVEVSX0tFWVxuICAgICk7XG4gICAgcmV0dXJuIGdldC5hcHBseShudWxsLCBhcmdzKTtcbiAgfTtcblxuICBTdG9yZUZhY2FkZS5wcm90b3R5cGUuZ2V0S2V5PWZ1bmN0aW9uKGtleSkgICAgICAgICAgICAgICAgICAgICAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7Zm9yICh2YXIgYXJncz1bXSwkX18wPTEsJF9fMT1hcmd1bWVudHMubGVuZ3RoOyRfXzA8JF9fMTskX18wKyspIGFyZ3MucHVzaChhcmd1bWVudHNbJF9fMF0pO1xuICAgIGVuZm9yY2VLZXlJc0RlZmluZWQodGhpcy4kU3RvcmVGYWNhZGVfZ2V0dGVycywga2V5LCBTQ09QRV9ISU5UKTtcbiAgICByZXR1cm4gdGhpcy4kU3RvcmVGYWNhZGVfZ2V0dGVyc1trZXldLmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9O1xuXG4gIFN0b3JlRmFjYWRlLnByb3RvdHlwZS5nZXREaXNwYXRjaGVyPWZ1bmN0aW9uKCkgICAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgcmV0dXJuIHRoaXMuJFN0b3JlRmFjYWRlX2Rpc3BhdGNoZXI7XG4gIH07XG5cbiAgU3RvcmVGYWNhZGUucHJvdG90eXBlLmdldERpc3BhdGNoVG9rZW49ZnVuY3Rpb24oKSAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy4kU3RvcmVGYWNhZGVfZGlzcGF0Y2hUb2tlbjtcbiAgfTtcblxuICBTdG9yZUZhY2FkZS5wcm90b3R5cGUuJFN0b3JlRmFjYWRlX2hhbmRsZURpc3BhdGNoPWZ1bmN0aW9uKFxuJF9fMCApICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7dmFyIGFjdGlvblR5cGU9JF9fMC5hY3Rpb25UeXBlLGRhdGE9JF9fMC5kYXRhO1xuICAgIGVuZm9yY2VLZXlJc0RlZmluZWQodGhpcy4kU3RvcmVGYWNhZGVfcmVzcG9uc2VzLCBhY3Rpb25UeXBlLCBTQ09QRV9ISU5UKTtcbiAgICB0aGlzLiRTdG9yZUZhY2FkZV9yZXNwb25zZXNbYWN0aW9uVHlwZV0oZGF0YSwgYWN0aW9uVHlwZSk7XG4gICAgdGhpcy50cmlnZ2VyQ2hhbmdlKCk7XG4gIH07XG5cbiAgU3RvcmVGYWNhZGUucHJvdG90eXBlLnJlbW92ZU9uQ2hhbmdlPWZ1bmN0aW9uKGNhbGxiYWNrKSAgICAgICAgICAgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICB2YXIgaW5kZXggPSB0aGlzLiRTdG9yZUZhY2FkZV9saXN0ZW5lcnMuaW5kZXhPZihjYWxsYmFjayk7XG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgdGhpcy4kU3RvcmVGYWNhZGVfbGlzdGVuZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFN0b3JlRmFjYWRlLnByb3RvdHlwZS50cmlnZ2VyQ2hhbmdlPWZ1bmN0aW9uKCkgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLiRTdG9yZUZhY2FkZV9saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcikgIHtyZXR1cm4gbGlzdGVuZXIuY2FsbCgpO30pO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFN0b3JlRmFjYWRlLnByb3RvdHlwZS53YWl0Rm9yPWZ1bmN0aW9uKCkgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICB0aGlzLiRTdG9yZUZhY2FkZV9kaXNwYXRjaGVyLndhaXRGb3IoXG4gICAgICB0aGlzLmdldERpc3BhdGNoVG9rZW4oKVxuICAgICk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlRmFjYWRlO1xuIl19
