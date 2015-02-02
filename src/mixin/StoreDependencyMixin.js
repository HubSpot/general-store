/**
 * @flow
 */

var EventHandler = require('../event/EventHandler.js');
var StoreDependencyDefinition = require('../store/StoreDependencyDefinition.js');
var StoreFacade = require('../store/StoreFacade.js');

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
