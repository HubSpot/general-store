/* @flow */
import type { Dispatcher } from 'flux';

export function handleDispatch(
  dispatcher: ?Dispatcher
) {
  const actionType = payload.actionType || payload.type;
  if (!dependencyIndex[actionType]) {
    return;
  }
  const entry = dependencyIndex[actionType];
  waitForStores(dispatcher, Object.keys(entry.dispatchTokens));
  this.setState(
    calculateForDispatch(dependencies, entry, this.props, this.state)
  );
}
