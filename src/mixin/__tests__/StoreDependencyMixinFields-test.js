jest.dontMock('../StoreDependencyMixinFields.js');

describe('StoreDependencyMixinFields', () => {

  var StoreDependencyMixinFields;

  var mockComponent;

  beforeEach(() => {
    StoreDependencyMixinFields = require('../StoreDependencyMixinFields.js');

    mockComponent = {};
  });

  it('returns the dependencies Object from dependencies()', () => {
    var {dependencies} = StoreDependencyMixinFields;
    var mockDependencies = dependencies(mockComponent);
    var mockValue = 'random';
    expect(typeof mockDependencies).toBe('object');
    mockDependencies.test = mockValue;
    expect(dependencies(mockComponent)).toBe(mockDependencies);
    expect(dependencies(mockComponent).test).toBe(mockValue);
  });

  it('returns the handlers Array from handlers()', () => {
    var {handlers} = StoreDependencyMixinFields;
    var mockHandlers = handlers(mockComponent);
    var mockHandler = {remove: function() {}};
    expect(Array.isArray(mockHandlers)).toBe(true);
    mockHandlers.push(mockHandler);
    expect(handlers(mockComponent)).toBe(mockHandlers);
    expect(handlers(mockComponent)[0]).toBe(mockHandler);
  });

  it('returns the queue Object from queue()', () => {
    var {queue} = StoreDependencyMixinFields;
    var mockQueue = queue(mockComponent);
    expect(typeof mockQueue).toBe('object');
    mockQueue.test = true;
    expect(queue(mockComponent)).toBe(mockQueue);
    expect(queue(mockComponent).test).toBe(true);
  });

  it('returns the stores Array from stores()', () => {
    var StoreFacade = require('../../store/StoreFacade.js');
    var {stores} = StoreDependencyMixinFields;
    var mockStores = stores(mockComponent);
    var mockStore = new StoreFacade();
    expect(Array.isArray(mockStores)).toBe(true);
    mockStores.push(mockStore);
    expect(stores(mockComponent)).toBe(mockStores);
    expect(stores(mockComponent)[0]).toBe(mockStore);
  });

  it('returns the storeFields Object from stores()', () => {
    var {storeFields} = StoreDependencyMixinFields;
    var mockFields = ['test', 'other'];
    var mockStoreID = 12345;
    var mockStoreFields = storeFields(mockComponent);
    expect(typeof mockStoreFields).toBe('object');
    mockStoreFields[mockStoreID] = mockFields;
    expect(storeFields(mockComponent)).toBe(mockStoreFields);
    expect(storeFields(mockComponent)[mockStoreID]).toBe(mockFields);
  });
});
