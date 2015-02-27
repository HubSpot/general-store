jest.dontMock('../StoreDependencyDefinition.js');

describe('StoreDependencyDefinition', () => {

  var StoreDependencyDefinition;
  var StoreFacade;

  var dependencies;

  var mockDeref;
  var mockStore;
  var mockValue;

  var otherMockStore;
  var otherMockValue;

  beforeEach(() => {
    StoreDependencyDefinition = require('../StoreDependencyDefinition.js');
    StoreFacade = require('../StoreFacade.js');

    mockValue = 'testing';
    mockDeref = jest.genMockFn().mockReturnValue(mockValue);
    mockStore = new StoreFacade();

    otherMockStore = new StoreFacade();
    otherMockValue = {other: 'mock'};
    otherMockStore.get = jest.genMockFn().mockReturnValue(otherMockValue);

    dependencies = new StoreDependencyDefinition({
      mockkey: {
        stores: [mockStore],
        deref: mockDeref
      },
      otherkey: otherMockStore
    });
  });

  it('throws if stores is not defined as a non-empty array in a complex dep', () => {
    expect(() => {
      new StoreDependencyDefinition({
        mockkey: {
          stores: mockStore,
          deref: mockDeref
        }
      });
    }).toThrow();
    expect(() => {
      new StoreDependencyDefinition({
        mockkey: {
          stores: [],
          deref: mockDeref
        }
      });
    }).toThrow();
    expect(() => {
      new StoreDependencyDefinition({
        mockkey: {
          stores: [mockStore, otherMockStore],
          deref: mockDeref
        }
      });
    }).not.toThrow();
  });

  it('throws if deref is not defined as a function in a complex dep', () => {
    expect(() => {
      new StoreDependencyDefinition({
        mockkey: {
          stores: [mockStore, otherMockStore]
        }
      });
    }).toThrow();
    expect(() => {
      new StoreDependencyDefinition({
        mockkey: {
          stores: [mockStore, otherMockStore],
          deref: []
        }
      });
    }).toThrow();
    expect(() => {
      new StoreDependencyDefinition({
        mockkey: {
          stores: [mockStore, otherMockStore],
          deref: mockDeref
        }
      });
    }).not.toThrow();
  });

  it('returns the correct store map', () => {
    expect(dependencies.getStores()).toEqual({
      mockkey: [
        mockStore
      ],
      otherkey: [
        otherMockStore
        ]
    });
  });

  it('returns the correct state map', () => {
    expect(dependencies.getState({}, {})).toEqual({
      mockkey: mockValue,
      otherkey: otherMockValue
    });
  });

  it('returns the right field values', () => {
    expect(dependencies.getStateField('mockkey', {}, {})).toEqual({
      mockkey: mockValue
    });
    expect(dependencies.getStateField('otherkey', {}, {})).toEqual({
      otherkey: otherMockValue
    });
  });

  it('calls the custom deref with the store the props and the state', () => {
    var mockProps = {test: true};
    var mockState = {state: 'woo!'};
    dependencies.getStateField('mockkey', mockProps, mockState);
    expect(mockDeref.mock.calls.length).toBe(1);
    expect(mockDeref.mock.calls[0]).toEqual([
      mockProps,
      mockState,
      [mockStore],
    ]);
  });

});
