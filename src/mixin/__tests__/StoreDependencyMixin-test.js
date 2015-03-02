jest.dontMock('../StoreDependencyMixin.js');

describe('StoreDependencyMixin without custom derefs', () => {

  var StoreDependencyMixin;

  beforeEach(() => {
    StoreDependencyMixin = require('../StoreDependencyMixin.js');
  });

  it('subscribes to stores in the map on componentWillMount', () => {
  });

  it('doesnt blow away existing handlers in componentWillMount', () => {
  });

  it('unsubscribes from stores in the map on componentWillUnmount', () => {
  });

  it('does NOT set state in componentWillUpdate', () => {
  });

  it('gets state in getInitialState', () => {
  });

});

describe('StoreDependencyMixin with custom derefs', () => {
  var StoreDependencyMixin;

  beforeEach(() => {
    StoreDependencyMixin = require('../StoreDependencyMixin.js');
  });

  it('does set state in componentWillUpdate', () => {
  });

  it('does NOT set state if no state has changed', () => {
  });

  it('sets state if props have changed', () => {
  });

  it('does NOT set state if only store state has changed', () => {
  });

  it('sets state if only store state has changed', () => {
  });

});

