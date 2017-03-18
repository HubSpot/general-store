jest.disableAutomock();
import {
  focuser,
  makeDisplayName,
  transferNonReactStatics,
} from '../BuildComponent';

describe('BuildComponent', () => {
  describe('focuser', () => {
    it('calls focus on wrappedInstance if it has a focus method', () => {
      expect(() => focuser({wrappedInstance: {}})).not.toThrow();
      const focus = jest.fn();
      const fakeInstance = {
        wrappedInstance: {focus},
      };
      focuser(fakeInstance, 'test', 123);
      expect(focus.mock.calls[0]).toEqual(['test', 123]);
    });
  });

  describe('makeDisplayName', () => {
    it('creates a prefixed displayName', () => {
      const BaseComponent = {displayName: 'BaseComponent'};
      expect(makeDisplayName('Test', BaseComponent)).toBe(
        'Test(BaseComponent)'
      );
    });
  });

  describe('transferNonReactStatics', () => {
    it('copies static props from one constructor to another', () => {
      const test = 'something else';
      const Fn1 = () => {};
      Fn1.test = test;
      const Fn2 = () => {};
      transferNonReactStatics(Fn1, Fn2);
      expect(Fn2.test).toBe(test);
    });

    it('ignores react statics', () => {
      const propTypes = {};
      const Fn1 = () => {};
      Fn1.propTypes = propTypes;
      const Fn2 = () => {};
      transferNonReactStatics(Fn1, Fn2);
      expect(Fn2.propTypes).toBe(undefined);
    });
  });
});
