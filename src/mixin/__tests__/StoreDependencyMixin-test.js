jest.dontMock('../StoreDependencyMixin.js');

describe('StoreDependencyMixin', () => {
  // let StoreDependencyMixin;

  beforeEach(() => {
    // StoreDependencyMixin = require('../StoreDependencyMixin.js');
  });

  describe('propTypes', () => {
    it('has propTypes if a dependency specifices them');
  });

  describe('componentWillMount', () => {
    it('registers a callback with the dispatcher');

    it('calculates and sets initial state');
  });

  describe('componentWillReceiveProps', () => {
    it('calculates and sets state');

    it('doesnt recalculate fields that dont use props');
  });

  describe('componentDidUpdate', () => {
    it('has a componentDidUpdate if a field uses state');

    it('bails out if only store state changed');

    it('only recalculates fields that use state');
  });

  describe('handleDispatch', () => {
    it('waits for all stores affected by the actionType');

    it('only updates fields affected by the actionType');
  });

  describe('componentWillUnmount', () => {
    it('unregisters its dispatcher callback');
  });
});
