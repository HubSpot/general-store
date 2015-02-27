/**
 * @flow
 */

var StoreFacade = require('../store/StoreFacade.js');

var invariant = require('../invariant.js');
var {fields, handlers, queue, stores} = require('./StoreDependencyMixinFields.js');

function defaultDeref(
  _,
  _,
  stores: Array<StoreFacade>
): any {
  return stores[0].get();
}

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

function applyDependencies(
  component: Object,
  dependencyMap: Object
): void {
  var componentFields = fields(component);
  var componentHandlers = handlers(component);
  var componentStores = stores(component);
  var newComponentStores = [];
  Object.keys(dependencyMap).forEach(field => {
    var dependency = dependencyMap[field];
    var dependencyStores;
    if (dependency instanceof StoreFacade) {
      dependencyStores = [dependency];
      invariant(
        !componentFields.hasOwnProperty(field),
        'StoreDependencyMixin: field "%s" is already defined',
        field
      );
      componentFields[field] = {
        deref: defaultDeref,
        stores: dependencyStores
      };
    } else {
      dependencyStores = dependency.stores;
      componentFields[field] = dependency;
    }
    // update the store-to-field map
    dependencyStores.forEach(store => {
      var storeId = store.getID();
      if (!componentStores.hasOwnProperty(storeId)) {
        componentStores[storeId] = [];
        // if we haven't seen this store bind a change handler
        componentHandlers.push(
          store.addOnChange(
            handleStoreChange.bind(
              null,
              component,
              storeId
            )
          )
        );
      }
      componentStores[storeId].push(field);
    });
  });
}

function cleanupDependencies(component: Object): void {
  var componentHandlers = handlers(component);
  while (componentHandlers.length) {
    componentHandlers.pop().remove();
  }
}

function getDependencyState(
  component: Object,
  fieldNames: ?Array<string>
): Object {
  var componentFields = fields(component);
  fieldNames = fieldNames || Object.keys(componentFields);
  var state = {};
  fieldNames.forEach(field => {
    var {deref, stores} = componentFields[field];
    state[field] = deref(
      component.props,
      component.state,
      stores
    );
  });
  return state;
}

function handleStoreChange(
  component: Object,
  storeId: number
): void {
  var componentQueue = queue(component);
  var queueWasEmpty = Object.keys(componentQueue).length === 0;
  stores(component)[storeId].forEach(field => {
    if (componentQueue.hasOwnProperty(field)) {
      return;
    }
    componentQueue[field] = true
    waitForFieldStores(component, field, storeId)
  });
  if (!queueWasEmpty) {
    return;
  }
  var componentFields = fields(component);
  var stateUpdate = {};
  Object.keys(componentQueue).forEach(field => {
    var {deref, stores} = componentFields[field];
    stateUpdate[field] = deref(
      component.props,
      component.state,
      stores
    );
    delete componentQueue[field];
  });
  component.setState(stateUpdate);
}

function waitForFieldStores(
  component: Object,
  field: string,
  currentStoreId: number
): void {
  var dependency = fields(component)[field];
  dependency.stores.forEach(store => {
    if (store.getID() === currentStoreId) {
      return;
    }
    store.getDispatcher().waitFor([store.getDispatchToken()]);
  });
}

function StoreDependencyMixin(
  dependencyMap: Object
): Object {
  var fieldNames = Object.keys(dependencyMap);
  var isFirstMixin = false;

  return {
    componentWillMount(): void {
    },

    componentWillReceiveProps(nextProps): void {
      if (!isFirstMixin || !havePropsChanged(this.props, nextProps)) {
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
      cleanupDependencies(this);
    },

    componentWillUpdate(nextProps, nextState): void { 
      if (!isFirstMixin) {
        return;
      }
      if (!hasStateChanged(fields(this), this.state, nextState)) {
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
