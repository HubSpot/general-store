/**
 * I'm not sure if it's possible to express the runtime enforcement
 * of a dispatcher instance, so I'll use weak mode for now.
 * @flow
 **/

import {isDispatcher} from './DispatcherInterface.js';
import invariant from '../invariant.js';

let instance = null;

export default {
  get(): ?Dispatcher {
    return instance;
  },

  set(dispatcher: Dispatcher): void {
    invariant(
      isDispatcher(dispatcher),
      'DispatcherInstance.set: Expected dispatcher to be an object' +
      ' with a register method, and an unregister method but got "%s".' +
      ' Learn more about the dispatcher interface:' +
      ' https://github.com/HubSpot/general-store#dispatcher-interface',
      dispatcher
    );
    instance = dispatcher;
  },
};
