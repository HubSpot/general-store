/* eslint no-unused-vars: 1 */
jest
  .unmock('../DependencyMap')
  .unmock('../../store/Store');

import {
  calculate,
  calculateInitial,
  calculateForDispatch,
  calculateForPropsChange,
  calculateForStateChange,
  dependenciesUseState,
  dependencyPropTypes,
  enforceValidDependencies,
  makeDependencyIndex,
} from '../DependencyMap';
import { Dispatcher } from 'flux';
import Store from '../../store/Store';
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
    mockProps = {testProp: 123};
    mockState = {testState: 456};
    CountStore = new Store({
      dispatcher,
      factory: new StoreFactory(),
      getter: (state) => state,
      initialState,
      responses: {
        [DECREMENT]: (count) => count - 1,
        [INCREMENT]: (count) => count + 1,
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
        deref: (props) => Math.abs(CountStore.get()),
      },
      timesAHundred: {
        stores: [CountStore],
        deref: (props, state) => CountStore.get() * 100,
      },
      timesAHundredMinusState: {
        stores: [CountStore],
        deref: (props, state) => CountStore.get() * 100 - state.testState,
      },
    };
  });

  describe('dependencyPropTypes', () => {
    it('returns an empty object if no types are defined', () => {
      expect(
        dependencyPropTypes(dependencies)
      ).toEqual({});
    });
  });

  describe('enforceValidDependencies', () => {
    it('throws if dependencies is not an object', () => {
      expect(() => enforceValidDependencies(null)).toThrow();
      expect(() => enforceValidDependencies({})).not.toThrow();
    });

    it('throws if a dependency is not an object', () => {
      expect(() => enforceValidDependencies({
        test: null,
      })).toThrow();
    });

    it('throws if a dependency.deref is not a function', () => {
      expect(() => enforceValidDependencies({
        test: {
          stores: [],
          deref: null,
        },
      })).toThrow();
    });

    it('throws if a dependency.stores is not an Array', () => {
      expect(() => enforceValidDependencies({
        test: {
          stores: null,
          deref: () => {},
        },
      })).toThrow();
    });

    it('throws if an item in dependency.stores is not Store', () => {
      expect(() => enforceValidDependencies({
        test: {
          stores: [null],
          deref: () => {},
        },
      })).toThrow();
    });

    it('doesnt throw if the dependency is valid', () => {
      expect(() => enforceValidDependencies({
        test: {
          stores: [CountStore],
          deref: () => {},
        },
      })).not.toThrow();
    });
  });

  describe('calculate', () => {
    it('calls get on a store', () => {
      expect(calculate(CountStore)).toEqual(initialState);
    });

    it('it passes no args to deref with arity 0', () => {
      expect(
        calculate({
          stores: [CountStore],
          deref(...args) {
            expect(args[0]).toBe(undefined);
            expect(args[1]).toBe(undefined);
            expect(args[2]).toBe(undefined);
            return CountStore.get();
          },
        }, mockProps, mockState)
      ).toEqual(initialState);
    });

    it('it passes props to deref with arity 1', () => {
      expect(
        calculate({
          stores: [CountStore],
          deref(props, ...args) {
            expect(props).toBe(mockProps);
            expect(args[1]).toBe(undefined);
            expect(args[2]).toBe(undefined);
            return CountStore.get();
          },
        }, mockProps, mockState)
      ).toEqual(initialState);
    });

    it('it passes props, state, stores to deref with arity 2', () => {
      const mockStores = [CountStore];
      expect(
        calculate({
          stores: mockStores,
          deref: function testDeref(props, state, stores) {
            expect(props).toBe(mockProps);
            expect(state).toBe(mockState);
            expect(stores).toBe(mockStores);
            return CountStore.get();
          },
        }, mockProps, mockState)
      ).toEqual(initialState);
    });

    it('it passes props, state, stores to deref with arity 3', () => {
      const mockStores = [CountStore];
      expect(
        calculate({
          stores: mockStores,
          deref: function testDeref(props, state, stores) {
            expect(props).toBe(mockProps);
            expect(state).toBe(mockState);
            expect(stores).toBe(mockStores);
            return CountStore.get();
          },
        }, mockProps, mockState)
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
        calculateForDispatch(
          dependencies,
          mockIndexEntry,
          {},
          {}
        )
      ).toEqual({
        count: initialState,
        absCount: initialState,
      });
    });
  });

  describe('calculateForPropsChange', () => {
    it('calculates dependencies with deref arity > 1', () => {
      const result = calculateForPropsChange(
        dependencies,
        mockProps,
        mockState
      );
      expect(result).toEqual({
        absCount: initialState,
        timesAHundred: initialState * 100,
        timesAHundredMinusState: initialState * 100 - mockState.testState,
      });
    });
  });

  describe('calculateForStateChange', () => {
    it('calculates dependencies with deref arity > 2', () => {
      const result = calculateForStateChange(
        dependencies,
        mockProps,
        mockState
      );
      expect(result).toEqual({
        timesAHundred: initialState * 100,
        timesAHundredMinusState: initialState * 100 - mockState.testState,
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
        [CountStore.getDispatchToken()]: true,
      });
    });
  });

  describe('dependenciesUseState', () => {
    it('reports `false` if no derefs are arity > 2', () => {
      expect(
        dependenciesUseState({
          count: dependencies.count,
          negativeCount: dependencies.negativeCount,
          absCount: dependencies.absCount,
        })
      ).toBe(false);
    });

    it('reports `true` if any derefs are arity > 2', () => {
      expect(
        dependenciesUseState(dependencies)
      ).toBe(true);
    });
  });
});
