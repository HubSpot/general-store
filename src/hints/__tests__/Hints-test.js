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

  it('throws from enforceDispatcherPayloadInterface', () => {
    // invalid payloads
    expect(() => {
      Hints.enforceDispatcherPayloadInterface({});
    }).toThrow();

    expect(() => {
      Hints.enforceDispatcherPayloadInterface({
        actionType: 210395,
        data: 14
      });
    }).toThrow();

    expect(() => {
      Hints.enforceDispatcherPayloadInterface({
        actionType: 'test-action'
      });
    }).toThrow();

    // valid paylod
    expect(() => {
      Hints.enforceDispatcherPayloadInterface({
        actionType: 'test-action',
        data: {}
      });
    }).not.toThrow();
  });

});
