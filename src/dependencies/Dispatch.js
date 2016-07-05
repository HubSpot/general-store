/* @flow */
import type { Dispatcher } from 'flux';
import type { DependencyIndex } from './DependencyMap';

export function waitForStores(
  dispatcher: Dispatcher,
  tokens: Array<string>
) {
  dispatcher.waitFor(tokens);
}

export function handleDispatch(
  dispatcher: Dispatcher,
  dependencyIndex: DependencyIndex,
  then: Function,
  payload: Object
) {
  const actionType = payload.actionType || payload.type;
  if (!dependencyIndex[actionType]) {
    return;
  }
  const entry = dependencyIndex[actionType];
  waitForStores(dispatcher, Object.keys(entry.dispatchTokens));
  then(entry);
}
