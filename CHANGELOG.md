## 0.5.0 (April 28th, 2016)

* NEW: compound fields can specify propTypes

## 0.4.0 (September 22nd, 2015)

* NEW: GeneralStore.defineFactory() allows for more composable/testable stores
* added StoreFactory
* StoreDefinition -> StoreSingleton
* StoreSingleton is based on StoreFactory
* StoreFacade -> Store
* dependency updates (flow 0.16)

## 0.3.2 (September 4th, 2015)

* fix "define" function conflict with ES6 modules and GeneralStore.define

## 0.3.1 (August 28th, 2015)

* disable the eslint "indent" rule because its breaking the build

## 0.3.0 (August 28th, 2015)

* immutable-is: pull in a copy of Immutable.is() instead of trying to sideload immutable itself
* transpile with babel
* build with webpack

## 0.2.2 (April 7th, 2015)

* Dont throw from `DispatcherInstance.get()` (still throws from `StoreFacade.register()`)

## 0.2.1 (March 21st, 2015)

* remove a duplicate argument name breaks babel

## 0.2.0 (March 6th, 2015)

* BREAKING (for non-FB-disapatcher users): adds calls to `dispatcher.waitFor()` and `dispatcher.isDispatching()`
* BREAKING: `deref` no longer receives a default object for `state` if the actual state is falsey
* dedups `setState` for fields with dependencies on multiple stores
* dedups `setState` across mixin instances
* dedups `setState` for stores with common action responses

## 0.1.2 (February 23th, 2015)

* StoreDependencyMixin: fix a bug when using multiple mixins on one component

## 0.1.1 (February 15th, 2015)

* StoreDependencyMixin: update fields based on props in `componentWillReceiveProps`
* StoreDependencyMixin: update fields based on state in `componentWillUpdate` and be sure to merge with `nextState`

## 0.1.0 (February 12th, 2015)

### Breaking Changes

* compound fields: the `store` property is now `stores` and *requires* an `Array<StoreFacade>`
* compound fields: the `deref` property is required
* compound fields: the `deref` function now receives an `Array<StoreFacade>` as its thrid argument instead of a single `StoreFacade`
* invariant exceptions are thrown in the production build

### Other Changes

* more verbose errors with helpful links
* strip verbose errors in the production build
* allow succint registering of one response to multiple actions

## 0.0.3 (February 3rd, 2015)

* first usable alpha
