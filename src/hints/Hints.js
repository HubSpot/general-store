/**
 * @flow
 */

var invariant = require('../invariant.js');

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
      ' and an unregister method but got "%s". Learn more about the' +
      ' dispatcher interface:' +
      ' https://github.com/HubSpot/general-store#dispatcher-interface',
      scope,
      dispatcher
    );
  }

};

module.exports = Hints;
