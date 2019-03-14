import { Action } from '../store/Store';
import { Dispatcher } from 'flux';
import invariant from 'invariant';

export function isDispatcher(dispatcher?: Dispatcher<any>): boolean {
  return (
    !!dispatcher &&
    typeof dispatcher === 'object' &&
    typeof dispatcher.register === 'function' &&
    typeof dispatcher.unregister === 'function'
  );
}

export function enforceDispatcher(dispatcher?: Dispatcher<any>): void {
  invariant(
    isDispatcher(dispatcher),
    'expected `dispatcher` to be a `Flux.Dispatcher` or compatible object but' +
      'got `%s` Learn more about the dispatcher interface:' +
      ' https://github.com/HubSpot/general-store#dispatcher-interface',
    dispatcher
  );
}

export function isPayload(payload: Action): boolean {
  return (
    payload !== null &&
    typeof payload === 'object' &&
    (typeof payload.actionType === 'string' || typeof payload.type === 'string')
  );
}
