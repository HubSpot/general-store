/* eslint no-unused-vars: 1 */
jest
  .unmock('../DependencyMap')
  .unmock('../../store/Store');

import {
  calculate,
  calculateInitial,
  calculateForPropsChange,
  calculateForStateChange,
  dependenciesUseState,
  dependencyPropTypes,
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
    };
  });

  describe('dependencyPropTypes', () => {
    it('returns an empty object if no types are defined', () => {
      expect(
        dependencyPropTypes(dependencies)
      ).toEqual({});
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
        timesAHundred: initialState * 100
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
