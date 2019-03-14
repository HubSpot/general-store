import {
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
import { Dispatcher } from 'flux';

function subscribe(
  dependencies: DependencyMap,
  dependencyIndex: DependencyIndex,
  dispatcher: Dispatcher<any>,
  callback: Function,
  props: Object = {},
  state: Object = null
) {
  let dispatchToken;
  let storeState = {};

  function remove() {
    if (dispatchToken) {
      dispatcher.unregister(dispatchToken);
      dispatchToken = null;
    }
  }

  function handleUpdate(entry: DependencyIndexEntry) {
    const prevStoreState = storeState;
    try {
      storeState = {
        ...prevStoreState,
        ...calculateForDispatch(dependencies, entry, props, state),
      };
      callback(null, storeState, prevStoreState, remove);
    } catch (error) {
      remove();
      callback(error, storeState, prevStoreState, remove);
    }
  }

  dispatchToken = dispatcher.register(
    handleDispatch.bind(null, dispatcher, dependencyIndex, handleUpdate)
  );

  try {
    storeState = calculateInitial(dependencies, props, state);
    callback(null, storeState, {}, remove);
  } catch (error) {
    remove();
    callback(error, storeState, {}, remove);
  }

  return { remove };
}

export default function connectCallback(
  dependencies: DependencyMap,
  dispatcher: Dispatcher<any> = getDispatcherInstance()
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
