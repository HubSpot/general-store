/* @flow */
import type { Dispatcher } from 'flux';

export function isDispatcher(dispatcher: Dispatcher): bool {
  return (
    typeof dispatcher === 'object' &&
    typeof dispatcher.register === 'function' &&
    typeof dispatcher.unregister === 'function'
  );
}

export function isPayload(payload: Dispatcher): bool {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    (typeof payload.actionType === 'string' || typeof payload.type === 'string')
  );
}
