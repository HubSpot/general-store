/**
 * @flow
 */

import {
  dependencies,
  stores,
} from './StoreDependencyMixinFields.js';
import {
  cleanupHandlers,
  setupHandlers,
} from './StoreDependencyMixinHandlers.js';
import {applyDependencies} from './StoreDependencyMixinInitialize.js';
import {getDependencyState} from './StoreDependencyMixinState.js';
import {
  hasPropsChanged,
  hasStateChanged,
} from './StoreDependencyMixinTransitions.js';

export default function StoreDependencyMixin(
  dependencyMap: Object
): Object {
  var fieldNames = Object.keys(dependencyMap);
  var isFirstMixin = false;

  return {
    componentWillMount(): void {
      if (!isFirstMixin) {
        return;
      }
      setupHandlers(this);
    },

    componentWillReceiveProps(nextProps): void {
      if (!isFirstMixin || !hasPropsChanged(this.props, nextProps)) {
        return;
      }
      this.setState(
        getDependencyState(this, nextProps, this.state, null)
      );
    },

    componentWillUnmount(): void {
      if (!isFirstMixin) {
        return;
      }
      cleanupHandlers(this);
    },

    componentDidUpdate(oldProps, oldState): void {
      if (
        !isFirstMixin ||
        !hasStateChanged(dependencies(this), oldState, this.state)
      ) {
        return;
      }
      this.setState(
        getDependencyState(this, this.props, this.state, null)
      );
    },

    getInitialState(): Object {
      isFirstMixin = !stores(this).length;
      applyDependencies(this, dependencyMap);
      return getDependencyState(
        this,
        this.props,
        this.state,
        Object.keys(dependencyMap)
      );
    },
  };

}
