jest.dontMock('../StoreFactory.js');

describe('StoreFactory', () => {

  var StoreFactory;

  var storeFactory;

  beforeEach(() => {
    StoreFactory = require('../StoreFactory.js');
    storeFactory = new StoreFactory({});
  });

  it('sets the default definition', () => {
    expect(storeFactory.getDefinition()).toEqual({
      getter: undefined,
      initialData: undefined,
      responses: {},
    });
  });

  it('returns a new store', () => {
    expect(
      storeFactory.defineGet(function() {})
    ).not.toBe(storeFactory);
    expect(
      storeFactory.defineResponses({})
    ).not.toBe(storeFactory);
    expect(
      storeFactory.defineInitialData({})
    ).not.toBe(storeFactory);
  });

  it('sets getter', () => {
    var mockGetter = function() {};
    var newDef = storeFactory.defineGet(mockGetter).getDefinition();
    expect(newDef.getter).toBe(mockGetter);
  });

  it('throws when a getter is already set', () => {
    var factoryWithGetter = storeFactory.defineGet(function() {});
    expect(
      () => factoryWithGetter.defineGet(function() {})
    ).toThrow();
  });

  it('sets initialData', () => {
    var mockData = {};
    var newDef = storeFactory.defineInitialData(mockData).getDefinition();
    expect(newDef.initialData).toBe(mockData);
  });

  it('throws when initialData is already set', () => {
    var factoryWithInitialData = storeFactory.defineInitialData({});
    expect(
      () => factoryWithInitialData.defineInitialData({})
    ).toThrow();
  });

  it('sets responses', () => {
    var mockResponses = {
      TEST: function() {},
      TEST_TWO: function() {},
    };
    var newDef = storeFactory.defineResponses(mockResponses).getDefinition();
    Object.keys(mockResponses).forEach(actionType => {
      expect(newDef.responses[actionType]).toBe(mockResponses[actionType]);
    });
  });

  it('throws when a response is already set', () => {
    var factoryWithResponses = storeFactory.defineResponses({
      TEST: function() {},
      TEST_TWO: function() {},
    });
    expect(
      () => factoryWithResponses.defineResponses({
        TEST_THREE: function() {},
      })
    ).not.toThrow();
    expect(
      () => factoryWithResponses.defineResponses({
        TEST: function() {},
      })
    ).toThrow();
  });

});
