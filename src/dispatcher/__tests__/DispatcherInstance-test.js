jest.dontMock('../DispatcherInstance.js');

describe('DispatcherInstance', () => {

  var DispatcherInstance;

  beforeEach(() => {
    DispatcherInstance = require('../DispatcherInstance.js');

    mockDispatcher = {
      register: function() {
        return 12345;
      },
      unregister: function() {
      }
    }
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
