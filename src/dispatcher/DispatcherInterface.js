/* @flow */
import type { Action, Dispatcher } from 'flux';

export function isDispatcher(dispatcher: ?Dispatcher): bool {
  return (
    !!dispatcher &&
    typeof dispatcher === 'object' &&
    typeof dispatcher.register === 'function' &&
    typeof dispatcher.unregister === 'function'
  );
}

export function isPayload(payload: Action): bool {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    (typeof payload.actionType === 'string' || typeof payload.type === 'string')
  );
}
