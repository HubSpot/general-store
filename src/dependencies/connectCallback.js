// @flow
import type {
  DependencyIndex,
  DependencyIndexEntry,
  DependencyMap,
} from './DependencyMap';
import {
  calculateForDispatch,
  calculateInitial,
  makeDependencyIndex,
} from '../dependencies/DependencyMap';
import { handleDispatch } from './Dispatch';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { enforceDispatcher } from '../dispatcher/DispatcherInterface';
import type { Dispatcher } from 'flux';

function subscribe(
  dependencies: DependencyMap,
  dependencyIndex: DependencyIndex,
  dispatcher: Dispatcher,
  callback: Function,
  props: Object = {},
  state: Object = {}
) {
  let dispatchToken;
  let storeState;

  function remove() {
    if (dispatchToken) {
      dispatcher.unregister(dispatchToken);
      dispatchToken = null;
    }
  }

  function handleUpdate(entry: DependencyIndexEntry) {
    const prevStoreState = storeState;
    storeState = {
      ...prevStoreState,
      ...calculateForDispatch(dependencies, entry, props, state),
    };
    callback(storeState, prevStoreState, remove);
  }

  dispatchToken = dispatcher.register(
    handleDispatch.bind(
      null,
      dispatcher,
      dependencyIndex,
      handleUpdate
    )
  );
  storeState = calculateInitial(dependencies, props, state);
  callback(storeState, {}, remove);
  return {remove};
}

export default function connectCallback(
  dependencies: DependencyMap,
  dispatcher: ?Dispatcher = getDispatcherInstance()
) {
  enforceDispatcher(dispatcher);
  if (!dispatcher) {
    return null;
  }

  return subscribe.bind(
    null,
    dependencies,
    makeDependencyIndex(dependencies),
    dispatcher
  );
}
