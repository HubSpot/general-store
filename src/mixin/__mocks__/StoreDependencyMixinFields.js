
var MockStoreDependencyMixinFields = {
  actions: jest.genMockFn().mockReturnValue({}),
  dependencies: jest.genMockFn().mockReturnValue({}),
  getDispatcherInfo: jest.genMockFn().mockReturnValue({
    dispatcher: null,
    token: null
  }),
  handlers: jest.genMockFn().mockReturnValue([]),
  queue: jest.genMockFn().mockReturnValue({}),
  stores: jest.genMockFn().mockReturnValue([]),
  storeFields: jest.genMockFn().mockReturnValue({})
};

module.exports = MockStoreDependencyMixinFields;
