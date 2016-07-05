jest.unmock('../ObjectUtils');

import {
  oForEach,
  oFilterMap,
  oMap,
  oReduce,
} from '../ObjectUtils';

describe('ObjectUtils', () => {
  describe('oForEach', () => {
    it('applies the runs the iterator on each key/value', () => {
      let count = 0;
      oForEach(
        {one: 1, two: 2, three: 3},
        (value) => {
          count = count + value;
        }
      );
      expect(count).toBe(6);
    });
  });

  describe('oMap', () => {
    it('applies the mapper to each key/value', () => {
      const increment = (n) => n + 1;
      expect(
        oMap(
          {one: 1, two: 2, three: 3},
          increment
        )
      ).toEqual(
        {one: 2, two: 3, three: 4}
      );
    });
  });

  describe('oReduce', () => {
    it('applies the reducer to each key/value', () => {
      expect(
        oReduce(
          {one: 1, two: 2, three: 3},
          (count, n) => count + n,
          0
        )
      ).toEqual(6);
    });
  });

  describe('oFilterMap', () => {
    it('applies the filterer then the mapper', () => {
      const increment = (n) => n + 1;
      const odd = (n) => n % 2 === 1;
      expect(
        oFilterMap(
          {one: 1, two: 2, three: 3},
          odd,
          increment
        )
      ).toEqual(
        {one: 2, three: 4}
      );
    });
  });
});
