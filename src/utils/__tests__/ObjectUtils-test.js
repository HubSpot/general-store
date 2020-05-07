jest.unmock('../ObjectUtils');

import { Map } from 'immutable';
import {
  oForEach,
  oMap,
  oMerge,
  oReduce,
  shallowEqual,
  deepEqual,
} from '../ObjectUtils';

describe('ObjectUtils', () => {
  describe('oForEach', () => {
    it('applies the runs the iterator on each key/value', () => {
      let count = 0;
      oForEach({ one: 1, two: 2, three: 3 }, value => {
        count = count + value;
      });
      expect(count).toBe(6);
    });
  });

  describe('oMap', () => {
    it('applies the mapper to each key/value', () => {
      const increment = n => n + 1;
      expect(oMap({ one: 1, two: 2, three: 3 }, increment)).toEqual({
        one: 2,
        two: 3,
        three: 4,
      });
    });
  });

  describe('oMerge', () => {
    it('mutates and returns `subject`', () => {
      const subject = { one: 1, three: 3 };
      expect(oMerge(subject, { two: 2 })).toBe(subject);
    });

    it('applies the update keys to the subject', () => {
      const subject = { one: 1, three: 3 };
      expect(oMerge(subject, { two: 2 })).toEqual({
        one: 1,
        two: 2,
        three: 3,
      });
    });
  });

  describe('oReduce', () => {
    it('applies the reducer to each key/value', () => {
      expect(
        oReduce({ one: 1, two: 2, three: 3 }, (count, n) => count + n, 0)
      ).toEqual(6);
    });
  });

  describe('shallowEqual', () => {
    it('shallowly compares values', () => {
      expect(shallowEqual(1, 1)).toBe(true);
      expect(shallowEqual(1, 0)).toBe(false);

      expect(shallowEqual(1, null)).toBe(false);
      expect(shallowEqual(1, undefined)).toBe(false);
      expect(shallowEqual(0, false)).toBe(false);

      expect(shallowEqual({}, null)).toBe(false);
      expect(shallowEqual({}, {})).toBe(true);

      expect(shallowEqual({ a: 1 }, {})).toBe(false);
      expect(shallowEqual({}, { a: 1 })).toBe(false);
      expect(shallowEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(shallowEqual({ a: 1 }, { a: 'different' })).toBe(false);
      expect(shallowEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(
        false
      );
    });

    it('shallowly compares immutable values', () => {
      expect(shallowEqual(Map({ a: 1 }), Map({ a: 1 }))).toBe(true);
      const mockImmutable1 = {
        hashCode() {
          return 1;
        },
        equals() {
          return false;
        },
      };
      const mockImmutable2 = {
        hashCode() {
          return 1;
        },
        equals() {
          return false;
        },
      };
      // force hash collision - should fall back to .equals
      expect(shallowEqual(mockImmutable1, mockImmutable2)).toBe(false);
    });

    it('handles immutable values if one input is falsy', () => {
      expect(() => shallowEqual(Map({ a: 1 }), null)).not.toThrow();
    });
  });

  describe('deepEqual', () => {
    it('deeply compares values', () => {
      expect(deepEqual(1, 1)).toBe(true);
      expect(deepEqual(1, 0)).toBe(false);

      expect(deepEqual(1, null)).toBe(false);
      expect(deepEqual(1, undefined)).toBe(false);
      expect(deepEqual(0, false)).toBe(false);

      expect(deepEqual({}, null)).toBe(false);
      expect(deepEqual({}, {})).toBe(true);

      expect(deepEqual({ a: 1 }, {})).toBe(false);
      expect(deepEqual({}, { a: 1 })).toBe(false);
      expect(deepEqual({ a: 1 }, { a: 1 })).toBe(true);
      expect(deepEqual({ a: 1 }, { a: 'different' })).toBe(false);
      expect(deepEqual({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toBe(
        true
      );
    });
  });
});
