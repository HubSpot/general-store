/**
 * @flow
 */

var StoreFacade = require('../store/StoreFacade.js');

var {fields, handlers} = require('./StoreDependencyMixinFields.js');
var {cleanupHandlers, setupHandlers} = require('./StoreDependencyMixinHandlers.js');
var {applyDependencies} = require('./StoreDependencyMixinInitialize.js');
var {getDependencyState} = require('./StoreDependencyMixinState.js');
var {hasPropsChanged, hasStateChanged, mergeState} = require('./StoreDependencyMixinTransitions.js');

function StoreDependencyMixin(
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
        getDependencyState(this, null)
      );
    },

    componentWillUnmount(): void {
      if (!isFirstMixin) {
        return;
      }
      cleanupHandlers(this);
    },

    componentWillUpdate(nextProps, nextState): void {
      if (!isFirstMixin || !hasStateChanged(fields(this), this.state, nextState)) {
        return;
      }
      this.setState(
        mergeState(
          nextState,
          getDependencyState(this, null)
        )
      );
    },

    getInitialState(): Object {
      applyDependencies(this, dependencyMap);
      isFirstMixin = !handlers(this).length;
      return getDependencyState(this, Object.keys(dependencyMap));
    }
  };

}

module.exports = StoreDependencyMixin;
