jest.dontMock('../TypeHints.js');

describe('TypeHints', () => {

  var TypeHints;
  var ScopeHint;

  beforeEach(() => {
    TypeHints = require('../TypeHints.js');
    ScopeHint = 'TypeHints-test';
  });

  it('throws from enforceDispatcherInterface', () => {
    // invalid dispatchers
    expect(() => {
      TypeHints.enforceDispatcherInterface({
        register: 'test'
      });
    }).toThrow();
    expect(() => {
      TypeHints.enforceDispatcherInterface({});
    }).toThrow();

    // valid dispatchers
    expect(() => {
      TypeHints.enforceDispatcherInterface({
        register: function() {
          return 'test-token';
        }
      }, ScopeHint);
    }).not.toThrow();
  });

  it('throws from enforceIsFunction', () => {
    expect(
      () => TypeHints.enforceIsFunction('test', ScopeHint)
    ).toThrow()
    expect(
      () => TypeHints.enforceIsFunction(1241, ScopeHint)
    ).toThrow()
    expect(
      () => TypeHints.enforceIsFunction({}, ScopeHint)
    ).toThrow()
    expect(
      () => TypeHints.enforceIsFunction(function() {}, ScopeHint)
    ).not.toThrow()
  });

  it('throws from enforceIsString', () => {
    expect(
      () => TypeHints.enforceIsString('test', ScopeHint)
    ).not.toThrow()
    expect(
      () => TypeHints.enforceIsString(1241, ScopeHint)
    ).toThrow()
    expect(
      () => TypeHints.enforceIsString({}, ScopeHint)
    ).toThrow()
    expect(
      () => TypeHints.enforceIsString(function() {}, ScopeHint)
    ).toThrow()
  });

  it('throws from enforceKeyIsDefined', () => {
    expect(() => {
      TypeHints.enforceKeyIsDefined(
        {random: 'blah'},
        'test',
        ScopeHint
      );
    }).toThrow()
    expect(() => {
      TypeHints.enforceKeyIsDefined(
        {test: 'testing'},
        'test',
        ScopeHint
      );
    }).not.toThrow()
  });

  it('throws from enforceKeyIsNotDefined', () => {
    expect(() => {
      TypeHints.enforceKeyIsNotDefined(
        {test: 'testing'},
        'test',
        ScopeHint
      );
    }).toThrow()
    expect(() => {
      TypeHints.enforceKeyIsNotDefined(
        {random: 'blah'},
        'test',
        ScopeHint
      );
    }).not.toThrow()
  });

});
