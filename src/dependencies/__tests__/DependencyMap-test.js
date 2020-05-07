const {
  calculate,
  calculateInitial,
  calculateForDispatch,
  dependencyPropTypes,
  enforceValidDependencies,
  makeDependencyIndex,
} = jest.requireActual('../DependencyMap');
const Store = jest.requireActual('../../store/Store').default;
import { Dispatcher } from 'flux';
import { getDispatchToken } from '../../store/InspectStore';
import StoreFactory from '../../store/StoreFactory';

describe('DependencyMap', () => {
  const DECREMENT = 'DECREMENT';
  const INCREMENT = 'INCREMENT';
  const initialState = 10;

  let CountStore;
  let dependencies;
  let dispatcher;
  let mockProps;
  let mockState;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    mockProps = { testProp: 123 };
    mockState = { testState: 456 };
    CountStore = new Store({
      dispatcher,
      factory: new StoreFactory(),
      getter: state => state,
      initialState,
      responses: {
        [DECREMENT]: count => count - 1,
        [INCREMENT]: count => count + 1,
      },
    });

    dependencies = {
      count: CountStore,
      negativeCount: {
        stores: [CountStore],
        deref: () => CountStore.get() * -1,
      },
      absCount: {
        stores: [CountStore],
        deref: props => Math.abs(CountStore.get()), // eslint-disable-line @typescript-eslint/no-unused-vars
      },
      timesAHundred: {
        stores: [CountStore],
        deref: (props, state) => CountStore.get() * 100, // eslint-disable-line @typescript-eslint/no-unused-vars
      },
      timesAHundredMinusState: {
        stores: [CountStore],
        deref: (props, state) => CountStore.get() * 100 - state.testState,
      },
    };
  });

  describe('dependencyPropTypes', () => {
    const isNumberType = () => {};
    const isStringType = () => {};
    const depsWithTypes = {
      countPlusN: {
        stores: [CountStore],
        propTypes: {
          n: isNumberType,
        },
        deref({ n }) {
          return CountStore.get() + n;
        },
      },
    };

    it('returns an empty object if no types are defined', () => {
      expect(dependencyPropTypes(dependencies)).toEqual({});
    });

    it('includes and dependency level propTypes', () => {
      expect(dependencyPropTypes(depsWithTypes)).toEqual({ n: isNumberType });
    });

    it('includes any existing propTypes', () => {
      const existing = {
        someProp: isStringType,
      };
      expect(dependencyPropTypes(depsWithTypes, existing)).toEqual({
        n: isNumberType,
        someProp: isStringType,
      });
    });

    it('drops any propTypes that conflict with the dependency', () => {
      const existing = {
        countPlusN: isNumberType,
        someProp: isStringType,
      };
      expect(dependencyPropTypes(depsWithTypes, existing)).toEqual({
        n: isNumberType,
        someProp: isStringType,
      });
    });
  });

  describe('enforceValidDependencies', () => {
    it('throws if dependencies is not an object', () => {
      expect(() => enforceValidDependencies(null)).toThrow();
      expect(() => enforceValidDependencies({})).not.toThrow();
    });

    it('throws if a dependency is not an object', () => {
      expect(() =>
        enforceValidDependencies({
          test: null,
        })
      ).toThrow();
    });

    it('throws if a dependency.deref is not a function', () => {
      expect(() =>
        enforceValidDependencies({
          test: {
            stores: [],
            deref: null,
          },
        })
      ).toThrow();
    });

    it('throws if a dependency.stores is not an Array', () => {
      expect(() =>
        enforceValidDependencies({
          test: {
            stores: null,
            deref: () => {},
          },
        })
      ).toThrow();
    });

    it('throws if an item in dependency.stores is not Store', () => {
      expect(() =>
        enforceValidDependencies({
          test: {
            stores: [null],
            deref: () => {},
          },
        })
      ).toThrow();
    });

    it('doesnt throw if the dependency is valid', () => {
      expect(() =>
        enforceValidDependencies({
          test: {
            stores: [CountStore],
            deref: () => {},
          },
        })
      ).not.toThrow();
    });
  });

  describe('calculate', () => {
    it('calls get on a store', () => {
      expect(calculate(CountStore)).toEqual(initialState);
    });

    it('it passes props, state, stores to deref', () => {
      const mockStores = [CountStore];
      expect(
        calculate(
          {
            stores: mockStores,
            deref: function testDeref(props, state, stores) {
              expect(props).toBe(mockProps);
              expect(state).toBe(mockState);
              expect(stores).toBe(mockStores);
              return CountStore.get();
            },
          },
          mockProps,
          mockState
        )
      ).toEqual(initialState);
    });
  });

  describe('calculateInitial', () => {
    it('calculates all dependencies', () => {
      const result = calculateInitial(dependencies, mockProps, mockState);
      expect(result).toEqual({
        absCount: initialState,
        count: initialState,
        negativeCount: -initialState,
        timesAHundred: initialState * 100,
        timesAHundredMinusState: initialState * 100 - mockState.testState,
      });
    });
  });

  describe('calculateForDispatch', () => {
    it('only calculates the fields in the index', () => {
      const mockIndexEntry = {
        fields: {
          count: true,
          absCount: true,
        },
      };
      expect(
        calculateForDispatch(dependencies, mockIndexEntry, {}, {})
      ).toEqual({
        count: initialState,
        absCount: initialState,
      });
    });
  });

  describe('makeDependencyIndex', () => {
    it('properly calculates fields affected by actions', () => {
      const index = makeDependencyIndex(dependencies);
      expect(index[INCREMENT].fields).toEqual({
        count: true,
        negativeCount: true,
        absCount: true,
        timesAHundred: true,
        timesAHundredMinusState: true,
      });
    });

    it('properly calculates dispatchTokens affected by actions', () => {
      const index = makeDependencyIndex(dependencies);
      expect(index[INCREMENT].dispatchTokens).toEqual({
        [getDispatchToken(CountStore)]: true,
      });
    });
  });
});
