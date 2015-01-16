(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/crabideau/Desktop/hs-store/src/hints/PrimitiveTypeHints.js":[function(require,module,exports){
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
        '" is not defined'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL29wdC9ib3hlbi9ub2RlbnYvdmVyc2lvbnMvdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2hpbnRzL1ByaW1pdGl2ZVR5cGVIaW50cy5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9zdG9yZS9TdG9yZUNvbnN0YW50cy5qcyIsInNyYy9zdG9yZS9TdG9yZURlZmluaXRpb24uanMiLCJzcmMvc3RvcmUvU3RvcmVGYWNhZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogQGZsb3cgKi9cblxuZnVuY3Rpb24gY29tcG9zZUVycm9yKGFyZ3MgICAgICAgICAgICApICAgICAgICB7XG4gIHJldHVybiBFcnJvcihcbiAgICBhcmdzLmpvaW4oJyAnKVxuICApO1xufVxuXG52YXIgUHJpbWl0aXZlVHlwZUhpbnRzID0ge1xuXG4gIGVuZm9yY2VJc0Z1bmN0aW9uOmZ1bmN0aW9uKGFyZyAgICAgLCBzY29wZSAgICAgICAgKSAgICAgICB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IGNvbXBvc2VFcnJvcihbXG4gICAgICAgIHNjb3BlLFxuICAgICAgICAnOiBleHBlY3RlZCBhIGZ1bmN0aW9uIGJ1dCBnb3QgXCInLFxuICAgICAgICBhcmcsXG4gICAgICAgICdcIiBpbnN0ZWFkLidcbiAgICAgIF0pO1xuICAgIH1cbiAgfSxcblxuICBlbmZvcmNlSXNTdHJpbmc6ZnVuY3Rpb24oXG4gICAgYXJnICAgICAsXG4gICAgc2NvcGUgICAgICAgIFxuICApICAgICAgIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IGNvbXBvc2VFcnJvcihbXG4gICAgICAgIHNjb3BlLFxuICAgICAgICAnOiBleHBlY3RlZCBhIHN0cmluZyBidXQgZ290IFwiJyxcbiAgICAgICAgYXJnLFxuICAgICAgICAnXCIgaW5zdGVhZC4nXG4gICAgICBdKTtcbiAgICB9XG4gIH0sXG5cbiAgZW5mb3JjZVVuaXF1ZUtleTpmdW5jdGlvbihcbiAgICBjb250ZXh0ICAgICAgICAsXG4gICAga2V5ICAgICAgICAsXG4gICAgc2NvcGUgICAgICAgIFxuICApICAgICAgIHtcbiAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0aHJvdyBjb21wb3NlRXJyb3IoW1xuICAgICAgICBzY29wZSxcbiAgICAgICAgJzogXCInLFxuICAgICAgICBrZXksXG4gICAgICAgICdcIiBpcyBhbHJlYWR5IGRlZmluZWQnXG4gICAgICBdKTtcbiAgICB9XG4gIH0sXG5cbiAgZW5mb3JjZUtleUlzRGVmaW5lZDpmdW5jdGlvbihcbiAgICBjb250ZXh0ICAgICAgICAsXG4gICAga2V5ICAgICAgICAsXG4gICAgc2NvcGUgICAgICAgIFxuICApICAgICAgIHtcbiAgICBpZiAoIWNvbnRleHQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgdGhyb3cgY29tcG9zZUVycm9yKFtcbiAgICAgICAgc2NvcGUsXG4gICAgICAgICc6IFwiJyxcbiAgICAgICAga2V5LFxuICAgICAgICAnXCIgaXMgbm90IGRlZmluZWQnXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmltaXRpdmVUeXBlSGludHM7XG4iLCIvKiBAZmxvdyAqL1xuXG52YXIgU3RvcmVEZWZpbml0aW9uID0gcmVxdWlyZSgnLi9zdG9yZS9TdG9yZURlZmluaXRpb24uanMnKTtcblxudmFyIEhTU3RvcmUgPSB7XG5cbiAgZGVmaW5lOmZ1bmN0aW9uKCkgICAgICAgICAgICAgICAgICB7XG4gICAgcmV0dXJuIG5ldyBTdG9yZURlZmluaXRpb24oKTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhTU3RvcmU7XG4iLCIvKiBAZmxvdyAqL1xuXG52YXIgU3RvcmVDb25zdGFudHMgPSB7XG4gIERFRkFVTFRfR0VUVEVSX0tFWTogJ0RFRkFVTFRfR0VUVEVSX0tFWSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmVDb25zdGFudHM7XG4iLCIvKiBAZmxvdyAqL1xuXG52YXIgU3RvcmVDb25zdGFudHMgPSByZXF1aXJlKCcuL1N0b3JlQ29uc3RhbnRzLmpzJyk7XG52YXIgU3RvcmVGYWNhZGUgPSByZXF1aXJlKCcuL1N0b3JlRmFjYWRlLmpzJyk7XG5cbnZhciAkX18wPVxuICBcbiAgXG4gIFxuICByZXF1aXJlKCcuLi9oaW50cy9QcmltaXRpdmVUeXBlSGludHMuanMnKSxlbmZvcmNlSXNGdW5jdGlvbj0kX18wLmVuZm9yY2VJc0Z1bmN0aW9uLGVuZm9yY2VJc1N0cmluZz0kX18wLmVuZm9yY2VJc1N0cmluZyxlbmZvcmNlVW5pcXVlS2V5PSRfXzAuZW5mb3JjZVVuaXF1ZUtleTtcblxudmFyIFNDT1BFX0hJTlQgPSAnU3RvcmVEZWZpbml0aW9uJztcblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuICBmdW5jdGlvbiBTdG9yZURlZmluaXRpb24oKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2ZhY2FkZSA9IG51bGw7XG4gICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2dldHRlcnMgPSB7fVxuICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9yZXNwb25zZXMgPSB7fTtcbiAgfVxuXG4gIFN0b3JlRGVmaW5pdGlvbi5wcm90b3R5cGUuZGVmaW5lR2V0PWZ1bmN0aW9uKFxuZ2V0dGVyKSAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIGVuZm9yY2VVbmlxdWVLZXkoXG4gICAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZ2V0dGVycyxcbiAgICAgIFN0b3JlQ29uc3RhbnRzLkRFRkFVTFRfR0VUVEVSX0tFWSxcbiAgICAgIFNDT1BFX0hJTlRcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmRlZmluZUdldEtleShcbiAgICAgIFN0b3JlQ29uc3RhbnRzLkRFRkFVTFRfR0VUVEVSX0tFWSxcbiAgICAgIGdldHRlclxuICAgICk7XG4gIH07XG5cbiAgU3RvcmVEZWZpbml0aW9uLnByb3RvdHlwZS5kZWZpbmVHZXRLZXk9ZnVuY3Rpb24oXG5rZXkgICAgICAgICxcbiAgICBnZXR0ZXIpICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIGVuZm9yY2VJc1N0cmluZyhrZXksIFNDT1BFX0hJTlQpO1xuICAgIGVuZm9yY2VJc0Z1bmN0aW9uKGdldHRlciwgU0NPUEVfSElOVCk7XG4gICAgZW5mb3JjZVVuaXF1ZUtleSh0aGlzLiRTdG9yZURlZmluaXRpb25fZ2V0dGVycywga2V5LCBTQ09QRV9ISU5UKTtcbiAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZW5mb3JjZVVucmVnaXN0ZXJlZCgpO1xuICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9nZXR0ZXJzW2tleV0gPSBnZXR0ZXI7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3RvcmVEZWZpbml0aW9uLnByb3RvdHlwZS5kZWZpbmVSZXNwb25zZVRvPWZ1bmN0aW9uKFxuYWN0aW9uVHlwZSAgICAgICAgLFxuICAgIHJlc3BvbnNlKSAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgXG4gICAgZW5mb3JjZUlzU3RyaW5nKGFjdGlvblR5cGUsIFNDT1BFX0hJTlQpO1xuICAgIGVuZm9yY2VJc0Z1bmN0aW9uKHJlc3BvbnNlLCBTQ09QRV9ISU5UKTtcbiAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fcmVzcG9uc2VzW2FjdGlvblR5cGVdID0gcmVzcG9uc2U7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3RvcmVEZWZpbml0aW9uLnByb3RvdHlwZS4kU3RvcmVEZWZpbml0aW9uX2VuZm9yY2VVbnJlZ2lzdGVyZWQ9ZnVuY3Rpb24oKSAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9mYWNhZGUgIT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgU0NPUEVfSElOVCArXG4gICAgICAgICc6IGEgc3RvcmUgZGVmaW5pdGlvbiBjYW5ub3QgYmUgbW9kaWZpZWQgYWZ0ZXIgaXQgaXMgcmVnaXN0ZXJlZCdcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIFN0b3JlRGVmaW5pdGlvbi5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oXG5kaXNwYXRjaGVyKSAgICAgICAgXG4gICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIHZhciBmYWNhZGUgPVxuICAgICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2ZhY2FkZSB8fCBuZXcgU3RvcmVGYWNhZGUoXG4gICAgICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9nZXR0ZXJzLFxuICAgICAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fcmVzcG9uc2VzLFxuICAgICAgICBkaXNwYXRjaGVyXG4gICAgICApO1xuICAgIGlmICh0aGlzLiRTdG9yZURlZmluaXRpb25fZmFjYWRlID09PSBudWxsKSB7XG4gICAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZmFjYWRlID0gZmFjYWRlO1xuICAgIH1cbiAgICByZXR1cm4gZmFjYWRlO1xuICB9O1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBTdG9yZURlZmluaXRpb247XG4iLCIvKiBAZmxvdyAqL1xudmFyIFN0b3JlQ29uc3RhbnRzID0gcmVxdWlyZSgnLi9TdG9yZUNvbnN0YW50cy5qcycpO1xuXG52YXIgJF9fMD1cbiAgXG4gIFxuICByZXF1aXJlKCcuLi9oaW50cy9QcmltaXRpdmVUeXBlSGludHMuanMnKSxlbmZvcmNlS2V5SXNEZWZpbmVkPSRfXzAuZW5mb3JjZUtleUlzRGVmaW5lZCxlbmZvcmNlSXNGdW5jdGlvbj0kX18wLmVuZm9yY2VJc0Z1bmN0aW9uO1xuXG52YXIgU0NPUEVfSElOVCA9ICdTdG9yZUZhY2FkZSc7XG5cblxuXG4gICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG5cbiAgZnVuY3Rpb24gU3RvcmVGYWNhZGUoXG5nZXR0ZXJzICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxcbiAgICByZXNwb25zZXMgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICxcbiAgICBkaXNwYXRjaGVyKSAgICAgICAgXG4gICB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy4kU3RvcmVGYWNhZGVfZGlzcGF0Y2hlciA9IGRpc3BhdGNoZXI7XG4gICAgdGhpcy4kU3RvcmVGYWNhZGVfZ2V0dGVycyA9IGdldHRlcnM7XG4gICAgdGhpcy4kU3RvcmVGYWNhZGVfcmVzcG9uc2VzID0gcmVzcG9uc2VzO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX2xpc3RlbmVycyA9IFtdO1xuXG4gICAgdGhpcy4kU3RvcmVGYWNhZGVfZGlzcGF0Y2hUb2tlbiA9XG4gICAgICB0aGlzLiRTdG9yZUZhY2FkZV9kaXNwYXRjaGVyXG4gICAgICAgIC5yZWdpc3RlcihmdW5jdGlvbihkYXRhKSAge3JldHVybiB0aGlzLiRTdG9yZUZhY2FkZV9oYW5kbGVEaXNwYXRjaChkYXRhKTt9LmJpbmQodGhpcykpO1xuICB9XG5cbiAgU3RvcmVGYWNhZGUucHJvdG90eXBlLmFkZE9uQ2hhbmdlPWZ1bmN0aW9uKGNhbGxiYWNrKSAgICAgICAgICAgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICBlbmZvcmNlSXNGdW5jdGlvbihjYWxsYmFjaywgU0NPUEVfSElOVCk7XG4gICAgdGhpcy4kU3RvcmVGYWNhZGVfbGlzdGVuZXJzLnB1c2goY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFN0b3JlRmFjYWRlLnByb3RvdHlwZS5nZXQ9ZnVuY3Rpb24oKSAgICAgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtmb3IgKHZhciBhcmdzPVtdLCRfXzA9MCwkX18xPWFyZ3VtZW50cy5sZW5ndGg7JF9fMDwkX18xOyRfXzArKykgYXJncy5wdXNoKGFyZ3VtZW50c1skX18wXSk7XG4gICAgdmFyIGdldCA9IHRoaXMuZ2V0S2V5LmJpbmQoXG4gICAgICB0aGlzLFxuICAgICAgU3RvcmVDb25zdGFudHMuREVGQVVMVF9HRVRURVJfS0VZXG4gICAgKTtcbiAgICByZXR1cm4gZ2V0LmFwcGx5KG51bGwsIGFyZ3MpO1xuICB9O1xuXG4gIFN0b3JlRmFjYWRlLnByb3RvdHlwZS5nZXRLZXk9ZnVuY3Rpb24oa2V5KSAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtmb3IgKHZhciBhcmdzPVtdLCRfXzA9MSwkX18xPWFyZ3VtZW50cy5sZW5ndGg7JF9fMDwkX18xOyRfXzArKykgYXJncy5wdXNoKGFyZ3VtZW50c1skX18wXSk7XG4gICAgZW5mb3JjZUtleUlzRGVmaW5lZCh0aGlzLiRTdG9yZUZhY2FkZV9nZXR0ZXJzLCBrZXksIFNDT1BFX0hJTlQpO1xuICAgIHJldHVybiB0aGlzLiRTdG9yZUZhY2FkZV9nZXR0ZXJzW2tleV0uYXBwbHkobnVsbCwgYXJncyk7XG4gIH07XG5cbiAgU3RvcmVGYWNhZGUucHJvdG90eXBlLmdldERpc3BhdGNoZXI9ZnVuY3Rpb24oKSAgICAgICAgIHtcInVzZSBzdHJpY3RcIjtcbiAgICByZXR1cm4gdGhpcy4kU3RvcmVGYWNhZGVfZGlzcGF0Y2hlcjtcbiAgfTtcblxuICBTdG9yZUZhY2FkZS5wcm90b3R5cGUuZ2V0RGlzcGF0Y2hUb2tlbj1mdW5jdGlvbigpICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIHJldHVybiB0aGlzLiRTdG9yZUZhY2FkZV9kaXNwYXRjaFRva2VuO1xuICB9O1xuXG4gIFN0b3JlRmFjYWRlLnByb3RvdHlwZS4kU3RvcmVGYWNhZGVfaGFuZGxlRGlzcGF0Y2g9ZnVuY3Rpb24oXG4kX18wICkgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgIHtcInVzZSBzdHJpY3RcIjt2YXIgYWN0aW9uVHlwZT0kX18wLmFjdGlvblR5cGUsZGF0YT0kX18wLmRhdGE7XG4gICAgZW5mb3JjZUtleUlzRGVmaW5lZCh0aGlzLiRTdG9yZUZhY2FkZV9yZXNwb25zZXMsIGFjdGlvblR5cGUsIFNDT1BFX0hJTlQpO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX3Jlc3BvbnNlc1thY3Rpb25UeXBlXShkYXRhLCBhY3Rpb25UeXBlKTtcbiAgICB0aGlzLnRyaWdnZXJDaGFuZ2UoKTtcbiAgfTtcblxuICBTdG9yZUZhY2FkZS5wcm90b3R5cGUucmVtb3ZlT25DaGFuZ2U9ZnVuY3Rpb24oY2FsbGJhY2spICAgICAgICAgICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIHZhciBpbmRleCA9IHRoaXMuJFN0b3JlRmFjYWRlX2xpc3RlbmVycy5pbmRleE9mKGNhbGxiYWNrKTtcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLiRTdG9yZUZhY2FkZV9saXN0ZW5lcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3RvcmVGYWNhZGUucHJvdG90eXBlLnRyaWdnZXJDaGFuZ2U9ZnVuY3Rpb24oKSAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX2xpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKSAge3JldHVybiBsaXN0ZW5lci5jYWxsKCk7fSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3RvcmVGYWNhZGUucHJvdG90eXBlLndhaXRGb3I9ZnVuY3Rpb24oKSAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIHRoaXMuJFN0b3JlRmFjYWRlX2Rpc3BhdGNoZXIud2FpdEZvcihcbiAgICAgIHRoaXMuZ2V0RGlzcGF0Y2hUb2tlbigpXG4gICAgKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuXG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmVGYWNhZGU7XG4iXX0=
