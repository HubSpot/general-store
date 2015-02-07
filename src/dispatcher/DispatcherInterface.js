/**
 * @flow
 */

var DispatcherInterface = {

  isDispatcher(dispatcher: Object): bool {
    return (
      typeof dispatcher === 'object' &&
      typeof dispatcher.register === 'function' &&
      typeof dispatcher.unregister === 'function'
    );
  },

  isPayload(payload: Object): bool {
    return (
      typeof payload === 'object' &&
      typeof payload.actionType === 'string' &&
      payload.hasOwnProperty('data')
    );
  }

};

module.exports = DispatcherInterface;
