## 0.2.0 (March 6th, 2015)

* BREAKING (for non-FB-disapatcher users): adds calls to `dispatcher.waitFor()` and `dispatcher.isDispatching()`
* BREAKING: `deref` not long receives a default object for `state` if the actual state is falsey
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
