/**
 * @flow
 */

var EventHandler = require('../event/EventHandler.js');
var StoreDependencyDefinition =
  require('../store/StoreDependencyDefinition.js');
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
    .some(
      key => !stores.hasOwnProperty(key) && oldState[key] !== nextState[key]
    );
}

function mergeState(state: Object, updates: Object): Object {
  var merged = {};
  for (var stateKey in state) {
    merged[stateKey] = state[stateKey];
  }
  for (var updatesKey in updates) {
    merged[updatesKey] = updates[updatesKey];
  }
  return merged;
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

var FIELDS_KEY = '__StoreDependencyMixin-Fields';
var HANDLERS_KEY = '__StoreDependencyMixin-EventHandlers';
var HAS_DEREF_KEY = '__StoreDependencyMixin-hasDeref';
var STORES_KEY = '__StoreDependencyMixin-Stores';

function fields(component: Object): Object {
  if (component.hasOwnProperty(FIELDS_KEY)) {
    component[FIELDS_KEY] = {};
  }
  return component[FIELDS_KEY];
}

function hasDeref(component: Object): bool {
  if (component.hasOwnProperty(HAS_DEREF_KEY)) {
    component[HAS_DEREF_KEY] = false;
  }
  return component[HAS_DEREF_KEY];
}

function handlers(component: Object): Array<EventHandler> {
  if (component.hasOwnProperty(HANDLERS_KEY)) {
    component[HANDLERS_KEY] = [];
  }
  return component[HANDLERS_KEY];
}

function stores(component: Object): Array<StoreFacade> {
  if (component.hasOwnProperty(STORES_KEY)) {
    component[STORES_KEY] = [];
  }
  return component[STORES_KEY];
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
      var i;
      var key;
      var store;
      var storeMap = dependencies.getStores();
      var stores;
      // there could be another store dependency mixin
      // so dont blow away existing handlers!
      if (!this._storeDependencyHandlers) {
        this._storeDependencyHandlers = [];
      }
      for (key in storeMap) {
        stores = storeMap[key];
        for (i = 0; i < stores.length; i++) {
          this._storeDependencyHandlers.push(
            stores[i].addOnChange(
              storeChangeCallback.bind(
                null,
                this,
                dependencies,
                key
              )
            )
          );
        }
      }
    },

    componentWillUnmount(): void {
      var handlers = this._storeDependencyHandlers;
      while (handlers.length) {
        handlers.pop().remove();
      }
    },

    componentWillReceiveProps(nextProps): void {
      if (!hasCustomDerefs || !havePropsChanged(this.props, nextProps)) {
        return;
      }
      this.setState(
        dependencies.getState(
          nextProps,
          this.state
        )
      );
    },

    componentWillUpdate(nextProps, nextState): void {
      if (
        !hasCustomDerefs ||
        !hasStateChanged(dependencies.getStores(), this.state, nextState)
      ) {
        return;
      }
      this.setState(
        mergeState(
          nextState,
          dependencies.getState(
            nextProps,
            nextState
          )
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
