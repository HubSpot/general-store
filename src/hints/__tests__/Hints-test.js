jest.dontMock('../Hints.js');

describe('Hints', () => {

  var Hints;

  var scope;

  beforeEach(() => {
    scope = 'Hints.unit-test';
    Hints = require('../Hints.js');
  });

  it('throws from enforceDispatcherInterface', () => {
    // invalid dispatchers
    expect(() => {
      Hints.enforceDispatcherInterface(scope, {
        register: 'test'
      });
    }).toThrow();

    expect(() => {
      Hints.enforceDispatcherInterface(scope, {});
    }).toThrow();

    expect(() => {
      Hints.enforceDispatcherInterface(scope, {
        register: function() {
          return 'test-token';
        }
      });
    }).toThrow();

    // valid dispatchers
    expect(() => {
      Hints.enforceDispatcherInterface(scope, {
        register: function() {
          return 1328471;
        },
        unregister: function() {
        }
      });
    }).not.toThrow();

  });

});
