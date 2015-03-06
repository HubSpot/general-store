jest.dontMock('../StoreDependencyMixin.js');

describe('StoreDependencyMixin', () => {

  var StoreDependencyMixin;

  var mockComponent;
  var mockMixin;

  beforeEach(() => {
    StoreDependencyMixin = require('../StoreDependencyMixin.js');

    mockComponent = {
      props: {},
      state: {},
      setState: jest.genMockFn()
    };
    mockMixin = StoreDependencyMixin({});
    mockMixin.getInitialState.call(mockComponent);
  });

  it('applies dependencies in getInitialState', () => {
    var {applyDependencies} = require('../StoreDependencyMixinInitialize.js');
    var {getDependencyState} = require('../StoreDependencyMixinState.js');
    expect(applyDependencies.mock.calls.length).toBe(1);
    expect(getDependencyState.mock.calls.length).toBe(1);
  });

  it('sets handlers in componentWillMount', () => {
    var {setupHandlers} = require('../StoreDependencyMixinHandlers.js');
    mockMixin.componentWillMount.call(mockComponent);
    expect(setupHandlers.mock.calls.length).toBe(1);
  });

  it('cleans up handlers in componentWillUnmount', () => {
    var {cleanupHandlers} = require('../StoreDependencyMixinHandlers.js');
    mockMixin.componentWillUnmount.call(mockComponent);
    expect(cleanupHandlers.mock.calls.length).toBe(1);
  });

  it('sets state if appropriate in componentWillReceiveProps', () => {
    var {hasPropsChanged} = require('../StoreDependencyMixinTransitions.js');
    hasPropsChanged.mockReturnValueOnce(false);
    mockMixin.componentWillReceiveProps.call(mockComponent);
    expect(mockComponent.setState.mock.calls.length).toBe(0);
    hasPropsChanged.mockReturnValueOnce(true);
    mockMixin.componentWillReceiveProps.call(mockComponent);
    expect(mockComponent.setState.mock.calls.length).toBe(1);
  });

  it('sets state if appropriate in componentDidUpdate', () => {
    var {hasStateChanged} = require('../StoreDependencyMixinTransitions.js');
    hasStateChanged.mockReturnValueOnce(false);
    mockMixin.componentDidUpdate.call(mockComponent);
    expect(mockComponent.setState.mock.calls.length).toBe(0);
    hasStateChanged.mockReturnValueOnce(true);
    mockMixin.componentDidUpdate.call(mockComponent);
    expect(mockComponent.setState.mock.calls.length).toBe(1);
  });

});

