/* @flow */
import type { Dispatcher } from 'flux';
import { isDispatcher } from './DispatcherInterface.js';
import invariant from 'invariant';

let instance = null;

export function get(): ?Dispatcher {
  return instance;
}

export function set(dispatcher: Dispatcher): void {
  invariant(
    isDispatcher(dispatcher),
    'DispatcherInstance.set: Expected dispatcher to be an object' +
    ' with a register method, and an unregister method but got "%s".' +
    ' Learn more about the dispatcher interface:' +
    ' https://github.com/HubSpot/general-store#dispatcher-interface',
    dispatcher
  );
  instance = dispatcher;
}
