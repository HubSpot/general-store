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

},{"../hints/PrimitiveTypeHints.js":"/Users/crabideau/Desktop/hs-store/src/hints/PrimitiveTypeHints.js","./StoreConstants.js":"/Users/crabideau/Desktop/hs-store/src/store/StoreConstants.js","./StoreFacade.js":"/Users/crabideau/Desktop/hs-store/src/store/StoreFacade.js"}],"/Users/crabideau/Desktop/hs-store/src/store/StoreFacade.js":[function(require,module,exports){

function StoreFacade(){"use strict";}



module.exports = StoreFacade;

},{}]},{},["/Users/crabideau/Desktop/hs-store/src/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL29wdC9ib3hlbi9ub2RlbnYvdmVyc2lvbnMvdjAuMTAuMjkvbGliL25vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwic3JjL2hpbnRzL1ByaW1pdGl2ZVR5cGVIaW50cy5qcyIsInNyYy9pbmRleC5qcyIsInNyYy9zdG9yZS9TdG9yZUNvbnN0YW50cy5qcyIsInNyYy9zdG9yZS9TdG9yZURlZmluaXRpb24uanMiLCJzcmMvc3RvcmUvU3RvcmVGYWNhZGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogQGZsb3cgKi9cblxuZnVuY3Rpb24gY29tcG9zZUVycm9yKGFyZ3MgICAgICAgICAgICApICAgICAgICB7XG4gIHJldHVybiBFcnJvcihcbiAgICBhcmdzLmpvaW4oJyAnKVxuICApO1xufVxuXG52YXIgUHJpbWl0aXZlVHlwZUhpbnRzID0ge1xuXG4gIGVuZm9yY2VJc0Z1bmN0aW9uOmZ1bmN0aW9uKGFyZyAgICAgLCBzY29wZSAgICAgICAgKSAgICAgICB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IGNvbXBvc2VFcnJvcihbXG4gICAgICAgIHNjb3BlLFxuICAgICAgICAnOiBleHBlY3RlZCBhIGZ1bmN0aW9uIGJ1dCBnb3QgXCInLFxuICAgICAgICBhcmcsXG4gICAgICAgICdcIiBpbnN0ZWFkLidcbiAgICAgIF0pO1xuICAgIH1cbiAgfSxcblxuICBlbmZvcmNlSXNTdHJpbmc6ZnVuY3Rpb24oXG4gICAgYXJnICAgICAsXG4gICAgc2NvcGUgICAgICAgIFxuICApICAgICAgIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IGNvbXBvc2VFcnJvcihbXG4gICAgICAgIHNjb3BlLFxuICAgICAgICAnOiBleHBlY3RlZCBhIHN0cmluZyBidXQgZ290IFwiJyxcbiAgICAgICAgYXJnLFxuICAgICAgICAnXCIgaW5zdGVhZC4nXG4gICAgICBdKTtcbiAgICB9XG4gIH0sXG5cbiAgZW5mb3JjZVVuaXF1ZUtleTpmdW5jdGlvbihcbiAgICBjb250ZXh0ICAgICAgICAsXG4gICAga2V5ICAgICAgICAsXG4gICAgc2NvcGUgICAgICAgIFxuICApICAgICAgIHtcbiAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICB0aHJvdyBjb21wb3NlRXJyb3IoW1xuICAgICAgICBzY29wZSxcbiAgICAgICAgJzogXCInLFxuICAgICAgICBrZXksXG4gICAgICAgICdcIiBpcyBhbHJlYWR5IGRlZmluZWQnXG4gICAgICBdKTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcmltaXRpdmVUeXBlSGludHM7XG4iLCIvKiBAZmxvdyAqL1xuXG52YXIgU3RvcmVEZWZpbml0aW9uID0gcmVxdWlyZSgnLi9zdG9yZS9TdG9yZURlZmluaXRpb24uanMnKTtcblxudmFyIEhTU3RvcmUgPSB7XG5cbiAgZGVmaW5lOmZ1bmN0aW9uKCkgICAgICAgICAgICAgICAgICB7XG4gICAgcmV0dXJuIG5ldyBTdG9yZURlZmluaXRpb24oKTtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEhTU3RvcmU7XG4iLCIvKiBAZmxvdyAqL1xuXG52YXIgU3RvcmVDb25zdGFudHMgPSB7XG4gIERFRkFVTFRfR0VUVEVSX0tFWTogJ0RFRkFVTFRfR0VUVEVSX0tFWSdcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3RvcmVDb25zdGFudHM7XG4iLCIvKiBAZmxvdyAqL1xuXG52YXIgU3RvcmVDb25zdGFudHMgPSByZXF1aXJlKCcuL1N0b3JlQ29uc3RhbnRzLmpzJyk7XG52YXIgU3RvcmVGYWNhZGUgPSByZXF1aXJlKCcuL1N0b3JlRmFjYWRlLmpzJyk7XG5cbnZhciAkX18wPVxuICBcbiAgXG4gIFxuICByZXF1aXJlKCcuLi9oaW50cy9QcmltaXRpdmVUeXBlSGludHMuanMnKSxlbmZvcmNlSXNGdW5jdGlvbj0kX18wLmVuZm9yY2VJc0Z1bmN0aW9uLGVuZm9yY2VJc1N0cmluZz0kX18wLmVuZm9yY2VJc1N0cmluZyxlbmZvcmNlVW5pcXVlS2V5PSRfXzAuZW5mb3JjZVVuaXF1ZUtleTtcblxudmFyIFNDT1BFX0hJTlQgPSAnU3RvcmVEZWZpbml0aW9uJztcblxuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcblxuICBmdW5jdGlvbiBTdG9yZURlZmluaXRpb24oKSB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2ZhY2FkZSA9IG51bGw7XG4gICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX2dldHRlcnMgPSB7fVxuICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9yZXNwb25zZXMgPSB7fTtcbiAgfVxuXG4gIFN0b3JlRGVmaW5pdGlvbi5wcm90b3R5cGUuZGVmaW5lR2V0PWZ1bmN0aW9uKFxuZ2V0dGVyKSAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIGVuZm9yY2VVbmlxdWVLZXkoXG4gICAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZ2V0dGVycyxcbiAgICAgIFN0b3JlQ29uc3RhbnRzLkRFRkFVTFRfR0VUVEVSX0tFWSxcbiAgICAgIFNDT1BFX0hJTlRcbiAgICApO1xuICAgIHJldHVybiB0aGlzLmRlZmluZUdldEtleShcbiAgICAgIFN0b3JlQ29uc3RhbnRzLkRFRkFVTFRfR0VUVEVSX0tFWSxcbiAgICAgIGdldHRlclxuICAgICk7XG4gIH07XG5cbiAgU3RvcmVEZWZpbml0aW9uLnByb3RvdHlwZS5kZWZpbmVHZXRLZXk9ZnVuY3Rpb24oXG5rZXkgICAgICAgICxcbiAgICBnZXR0ZXIpICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIGVuZm9yY2VJc1N0cmluZyhrZXksIFNDT1BFX0hJTlQpO1xuICAgIGVuZm9yY2VJc0Z1bmN0aW9uKGdldHRlciwgU0NPUEVfSElOVCk7XG4gICAgZW5mb3JjZVVuaXF1ZUtleSh0aGlzLiRTdG9yZURlZmluaXRpb25fZ2V0dGVycywga2V5LCBTQ09QRV9ISU5UKTtcbiAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZW5mb3JjZVVucmVnaXN0ZXJlZCgpO1xuICAgIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9nZXR0ZXJzW2tleV0gPSBnZXR0ZXI7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3RvcmVEZWZpbml0aW9uLnByb3RvdHlwZS5kZWZpbmVSZXNwb25zZVRvPWZ1bmN0aW9uKFxuYWN0aW9uVHlwZSAgICAgICAgLFxuICAgIHJlc3BvbnNlKSAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgXG4gICAgZW5mb3JjZUlzU3RyaW5nKGFjdGlvblR5cGUsIFNDT1BFX0hJTlQpO1xuICAgIGVuZm9yY2VJc0Z1bmN0aW9uKHJlc3BvbnNlLCBTQ09QRV9ISU5UKTtcbiAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fcmVzcG9uc2VzW2FjdGlvblR5cGVdID0gcmVzcG9uc2U7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU3RvcmVEZWZpbml0aW9uLnByb3RvdHlwZS4kU3RvcmVEZWZpbml0aW9uX2VuZm9yY2VVbnJlZ2lzdGVyZWQ9ZnVuY3Rpb24oKSAgICAgICB7XCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9mYWNhZGUgIT09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgU0NPUEVfSElOVCArXG4gICAgICAgICc6IGEgc3RvcmUgZGVmaW5pdGlvbiBjYW5ub3QgYmUgbW9kaWZpZWQgYWZ0ZXIgaXQgaXMgcmVnaXN0ZXJlZCdcbiAgICAgICk7XG4gICAgfVxuICB9O1xuXG4gIFN0b3JlRGVmaW5pdGlvbi5wcm90b3R5cGUucmVnaXN0ZXI9ZnVuY3Rpb24oXG5kaXNwYXRjaGVyKSAgICAgICAgXG4gICAgICAgICAgICAgICAge1widXNlIHN0cmljdFwiO1xuICAgIGlmICh0aGlzLiRTdG9yZURlZmluaXRpb25fZmFjYWRlKSB7XG4gICAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZmFjYWRlID0gbmV3IFN0b3JlRmFjYWRlKFxuICAgICAgICB0aGlzLiRTdG9yZURlZmluaXRpb25fZ2V0dGVycyxcbiAgICAgICAgdGhpcy4kU3RvcmVEZWZpbml0aW9uX3Jlc3BvbnNlcyxcbiAgICAgICAgZGlzcGF0Y2hlclxuICAgICAgKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuJFN0b3JlRGVmaW5pdGlvbl9mYWNhZGU7XG4gIH07XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlRGVmaW5pdGlvbjtcbiIsIlxuZnVuY3Rpb24gU3RvcmVGYWNhZGUoKXtcInVzZSBzdHJpY3RcIjt9XG5cblxuXG5tb2R1bGUuZXhwb3J0cyA9IFN0b3JlRmFjYWRlO1xuIl19
