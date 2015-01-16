jest.dontMock('../PrimitiveTypeHints.js');

describe('PrimitiveTypeHints', () => {

  var PrimitiveTypeHints;
  var ScopeHint;

  beforeEach(() => {
    PrimitiveTypeHints = require('../PrimitiveTypeHints.js');
    ScopeHint = 'PrimitiveTypeHints-test';
  });

  it('throws from enforceDispatcherInterface', () => {
    // invalid dispatchers
    expect(() => {
      PrimitiveTypeHints.enforceDispatcherInterface({
        register: 'test'
      });
    }).toThrow();
    expect(() => {
      PrimitiveTypeHints.enforceDispatcherInterface({});
    }).toThrow();

    // valid dispatchers
    expect(() => {
      PrimitiveTypeHints.enforceDispatcherInterface({
        register: function() {
          return 'test-token';
        }
      }, ScopeHint);
    }).not.toThrow();
  });

  it('throws from enforceIsFunction', () => {
    expect(
      () => PrimitiveTypeHints.enforceIsFunction('test', ScopeHint)
    ).toThrow()
    expect(
      () => PrimitiveTypeHints.enforceIsFunction(1241, ScopeHint)
    ).toThrow()
    expect(
      () => PrimitiveTypeHints.enforceIsFunction({}, ScopeHint)
    ).toThrow()
    expect(
      () => PrimitiveTypeHints.enforceIsFunction(function() {}, ScopeHint)
    ).not.toThrow()
  });

  it('throws from enforceIsString', () => {
    expect(
      () => PrimitiveTypeHints.enforceIsString('test', ScopeHint)
    ).not.toThrow()
    expect(
      () => PrimitiveTypeHints.enforceIsString(1241, ScopeHint)
    ).toThrow()
    expect(
      () => PrimitiveTypeHints.enforceIsString({}, ScopeHint)
    ).toThrow()
    expect(
      () => PrimitiveTypeHints.enforceIsString(function() {}, ScopeHint)
    ).toThrow()
  });

  it('throws from enforceKeyIsDefined', () => {
    expect(() => {
      PrimitiveTypeHints.enforceKeyIsDefined(
        {random: 'blah'},
        'test',
        ScopeHint
      );
    }).toThrow()
    expect(() => {
      PrimitiveTypeHints.enforceKeyIsDefined(
        {test: 'testing'},
        'test',
        ScopeHint
      );
    }).not.toThrow()
  });

  it('throws from enforceKeyIsNotDefined', () => {
    expect(() => {
      PrimitiveTypeHints.enforceKeyIsNotDefined(
        {test: 'testing'},
        'test',
        ScopeHint
      );
    }).toThrow()
    expect(() => {
      PrimitiveTypeHints.enforceKeyIsNotDefined(
        {random: 'blah'},
        'test',
        ScopeHint
      );
    }).not.toThrow()
  });

});
