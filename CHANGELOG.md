## 0.0.4 (*add data once we release*)

### Breaking Changes

* compound fields: the `store` property is now `stores` and *requires* an `Array<StoreFacade>`
* compound fields: the `deref` property is required
* compound fields: the `deref` function now receives an `Array<StoreFacade>` as its thrid argument instead of a single `StoreFacade`
* invariant exceptions are thrown in the production build

### Other Changes

* more verbose errors with helpful links
* strip verbose errors in the production build

## 0.0.3 (February 3rd, 2015)

* first usable alpha
