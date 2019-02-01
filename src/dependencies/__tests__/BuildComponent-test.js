jest.disableAutomock();
import {
  focuser,
  makeDisplayName,
} from '../BuildComponent';

describe('BuildComponent', () => {
  describe('focuser', () => {
    it('calls focus on wrappedInstance if it has a focus method', () => {
      expect(() => focuser({ wrappedInstance: {} })).not.toThrow();
      const focus = jest.fn();
      const fakeInstance = {
        wrappedInstance: { focus },
      };
      focuser(fakeInstance, 'test', 123);
      expect(focus.mock.calls[0]).toEqual(['test', 123]);
    });
  });

  describe('makeDisplayName', () => {
    it('creates a prefixed displayName using BaseComponent.displayName', () => {
      const BaseComponent = { displayName: 'BaseComponentDisplayName' };
      expect(makeDisplayName('Test', BaseComponent)).toBe(
        'Test(BaseComponentDisplayName)'
      );
    });

    it('creates a prefixed displayName using Function.name', () => {
      const BaseComponent = () => {};
      expect(makeDisplayName('Test', BaseComponent)).toBe(
        'Test(BaseComponent)'
      );
    });

    it('creates a prefixed displayName using a fallback if necessary', () => {
      const BaseComponent = {};
      expect(makeDisplayName('Test', BaseComponent)).toBe(
        'Test(Component)'
      );
    });
  });
});
