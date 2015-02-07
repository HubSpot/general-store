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

  it('throws if you get before setting', () => {
    expect(() => DispatcherInstance.get()).toThrow();
    DispatcherInstance.set(mockDispatcher);
    expect(() => DispatcherInstance.get()).not.toThrow();
  });

  it('returns the set dispatcher from get', () => {
    DispatcherInstance.set(mockDispatcher);
    expect(DispatcherInstance.get()).toBe(mockDispatcher);
  });

});
