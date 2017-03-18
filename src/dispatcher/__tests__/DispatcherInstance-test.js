jest.unmock('../DispatcherInstance.js');

describe('DispatcherInstance', () => {
  let DispatcherInstance;

  let mockDispatcher;

  beforeEach(() => {
    DispatcherInstance = require('../DispatcherInstance.js');

    mockDispatcher = {
      register() {
        return 12345;
      },
      unregister() {},
    };
  });

  it('throws if you set an invalid dispatcher', () => {
    expect(() => {
      DispatcherInstance.set('rando');
    }).toThrow();
    expect(() => {
      DispatcherInstance.set(mockDispatcher);
    }).not.toThrow();
  });

  it('returns the set dispatcher from get', () => {
    expect(DispatcherInstance.get()).toBe(null);
    DispatcherInstance.set(mockDispatcher);
    expect(DispatcherInstance.get()).toBe(mockDispatcher);
  });
});
