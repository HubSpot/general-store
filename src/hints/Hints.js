/**
 * @flow
 */

var invariant = require('../invariant.js');

var DISPATCHER_HINT_LINK =
  'Learn more about the dispatcher interface:' +
  ' https://github.com/HubSpot/general-store#dispatcher-interface';

if (process.env.NODE_ENV !== 'production') {
}
var Hints = {

  enforceDispatcherInterface(
    scope: string,
    dispatcher: Object
  ): void {
    invariant(
      typeof dispatcher === 'object' &&
        typeof dispatcher.register === 'function' &&
        typeof dispatcher.unregister === 'function',
      '%s: Expected dispatcher to be an object with a register method,' +
      ' and an unregister method but got "%s". %s',
      scope,
      dispatcher,
      DISPATCHER_HINT_LINK
    );
  },

  enforceDispatcherPayloadInterface(
    payload: Object
  ): void {
    invariant(
      typeof payload === 'object' &&
        typeof payload.actionType === 'string' &&
        payload.hasOwnProperty('data'),
      'Dispatcher.dispatch: expected payload to be an object with a property' +
      ' "actionType" containing a string and a property "data" containing any value' +
      ' but got "%s" instead. %s',
      payload,
      DISPATCHER_HINT_LINK
    );
  }

};

module.exports = Hints;
