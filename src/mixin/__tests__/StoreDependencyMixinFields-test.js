jest.dontMock('../StoreDependencyMixinFields.js');

describe('StoreDependencyMixinFields', () => {

  let StoreDependencyMixinFields;

  let mockComponent;

  beforeEach(() => {
    StoreDependencyMixinFields = require('../StoreDependencyMixinFields.js');

    mockComponent = {};
  });

  it('returns the dependencies Object from dependencies()', () => {
    let {dependencies} = StoreDependencyMixinFields;
    let mockDependencies = dependencies(mockComponent);
    let mockValue = 'random';
    expect(typeof mockDependencies).toBe('object');
    mockDependencies.test = mockValue;
    expect(dependencies(mockComponent)).toBe(mockDependencies);
    expect(dependencies(mockComponent).test).toBe(mockValue);
  });

  it('returns the handlers Array from handlers()', () => {
    let {handlers} = StoreDependencyMixinFields;
    let mockHandlers = handlers(mockComponent);
    let mockHandler = {remove: function() {}};
    expect(Array.isArray(mockHandlers)).toBe(true);
    mockHandlers.push(mockHandler);
    expect(handlers(mockComponent)).toBe(mockHandlers);
    expect(handlers(mockComponent)[0]).toBe(mockHandler);
  });

  it('returns the queue Object from queue()', () => {
    let {queue} = StoreDependencyMixinFields;
    let mockQueue = queue(mockComponent);
    expect(typeof mockQueue).toBe('object');
    mockQueue.test = true;
    expect(queue(mockComponent)).toBe(mockQueue);
    expect(queue(mockComponent).test).toBe(true);
  });

  it('returns the stores Array from stores()', () => {
    let Store = require('../../store/Store.js');
    let {stores} = StoreDependencyMixinFields;
    let mockStores = stores(mockComponent);
    let mockStore = new Store();
    expect(Array.isArray(mockStores)).toBe(true);
    mockStores.push(mockStore);
    expect(stores(mockComponent)).toBe(mockStores);
    expect(stores(mockComponent)[0]).toBe(mockStore);
  });

  it('returns the storeFields Object from stores()', () => {
    let {storeFields} = StoreDependencyMixinFields;
    let mockFields = ['test', 'other'];
    let mockStoreID = 12345;
    let mockStoreFields = storeFields(mockComponent);
    expect(typeof mockStoreFields).toBe('object');
    mockStoreFields[mockStoreID] = mockFields;
    expect(storeFields(mockComponent)).toBe(mockStoreFields);
    expect(storeFields(mockComponent)[mockStoreID]).toBe(mockFields);
  });
});
