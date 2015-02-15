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
