/* @flow */
import type { Dispatcher } from 'flux';
import type { DependencyIndex, DependencyIndexEntry } from './DependencyMap';

function waitForStores(
  dispatcher: Dispatcher,
  tokens: Array<string>
) {
  dispatcher.waitFor(tokens);
}

export function handleDispatch(
  dispatcher: Dispatcher,
  dependencyIndex: DependencyIndex,
  then: (entry: DependencyIndexEntry) => void,
  payload: Object
): void {
  const actionType: string = payload.actionType || payload.type;
  if (!dependencyIndex[actionType]) {
    return;
  }
  const entry = dependencyIndex[actionType];
  waitForStores(dispatcher, Object.keys(entry.dispatchTokens));
  then(entry);
}
