import { Dispatcher } from 'flux';
import { DependencyIndex, DependencyIndexEntry } from './DependencyMap';
import { Action } from '../store/Store';

function waitForStores(dispatcher: Dispatcher<any>, tokens: Array<string>) {
  dispatcher.waitFor(tokens);
}

export function handleDispatch(
  dispatcher: Dispatcher<any>,
  dependencyIndex: DependencyIndex,
  then: (entry: DependencyIndexEntry) => void,
  payload: Action
): void {
  const actionType: string = payload.actionType || payload.type;
  if (!dependencyIndex[actionType]) {
    return;
  }
  const entry = dependencyIndex[actionType];
  waitForStores(dispatcher, Object.keys(entry.dispatchTokens));
  then(entry);
}
