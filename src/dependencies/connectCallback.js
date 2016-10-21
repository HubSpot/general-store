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
  let prevState = calculateInitial(dependencies, props, state);

  function handleUpdate(entry: DependencyIndexEntry) {
    prevState = {
      ...prevState,
      ...calculateForDispatch(dependencies, entry, props, state),
    };
    callback(prevState);
  }

  let dispatchToken = dispatcher.register(
    handleDispatch.bind(
      null,
      dispatcher,
      dependencyIndex,
      handleUpdate
    )
  );

  callback(prevState);

  return {
    remove() {
      if (dispatchToken) {
        dispatcher.unregister(dispatchToken);
        dispatchToken = null;
      }
    },
  };
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
