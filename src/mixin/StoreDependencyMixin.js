/**
 * @flow
 */

var EventHandler = require('../event/EventHandler.js');
var StoreDependencyDefinition = require('../store/StoreDependencyDefinition.js');
var StoreFacade = require('../store/StoreFacade.js');

function havePropsChanged(
  oldProps: Object,
  nextProps: Object
): bool {
  return Object
    .keys(nextProps)
    .some(key => oldProps[key] !== nextProps[key]);
}

function hasStateChanged(
  stores: Object,
  oldState: Object,
  nextState: Object
): bool {
  return Object
    .keys(nextState)
    .some(key => !stores.hasOwnProperty(key) && oldState[key] !== nextState[key]);
}

function storeChangeCallback(
  component: Object,
  dependencies: StoreDependencyDefinition,
  key: string
): void {
  component.setState(
    dependencies.getStateField(
      key,
      component.props,
      component.state || {}
    )
  );
}

function StoreDependencyMixin(
  dependencyMap: Object
): Object {

  var dependencies = new StoreDependencyDefinition(dependencyMap);
  var hasCustomDerefs = Object
    .keys(dependencyMap)
    .some(key => dependencyMap[key].deref);

  return {
    componentWillMount(): void {
      var stores = dependencies.getStores();
      this._storeDependencyHandlers = Object.keys(stores).map(key => {
        return stores[key].addOnChange(
          storeChangeCallback.bind(
            null,
            this,
            dependencies,
            key
          )
        );
      });
    },

    componentWillUnmount(): void {
      var handlers = this._storeDependencyHandlers;
      while (handlers.length) {
        handlers.pop().remove();
      }
    },

    componentWillUpdate(nextProps, nextState): void {
      if (!hasCustomDerefs) {
        return;
      }
      if (
        !havePropsChanged(this.props, nextProps) &&
        !hasStateChanged(dependencies.getStores(), this.state, nextState)
      ) {
        return;
      }
      this.setState(
        dependencies.getState(
          nextProps,
          nextState || {}
        )
      );
    },

    getInitialState(): Object {
      return dependencies.getState(
        this.props,
        this.state || {}
      );
    },
  };
}

module.exports = StoreDependencyMixin;
