jest.dontMock('../StoreDependencyMixinTransitions.js');

describe('StoreDependencyMixinTransitions', () => {

  var StoreDependencyMixinTransitions;

  function merge(state, updates) {
    var merged = {};
    for (var stateKey in state) {
      merged[stateKey] = state[stateKey];
    }
    for (var updatesKey in updates) {
      merged[updatesKey] = updates[updatesKey];
    }
    return merged;
  }

  beforeEach(() => {
    StoreDependencyMixinTransitions =
      require('../StoreDependencyMixinTransitions.js');
  });

  it('shallow compares props', () => {
    var {hasPropsChanged} = StoreDependencyMixinTransitions;
    var old = {
      test: 'tester',
      obj: {},
    };
    expect(
      hasPropsChanged(old, {test: 'testing', obj: old.obj})
    ).toBe(true);
    expect(
      hasPropsChanged(old, {test: 'tester', obj: {}})
    ).toBe(true);
    expect(
      hasPropsChanged(old, {test: 'tester', obj: old.obj})
    ).toBe(false);
    old.obj.random = 'blah';
    expect(
      hasPropsChanged(old, {test: 'tester', obj: old.obj})
    ).toBe(false);
  });

  it('shallow compares state but ignores store fields', () => {
    var {hasStateChanged} = StoreDependencyMixinTransitions;
    var stores = {
      testStore: true,
    };
    var oldState = {
      testStore: 'random',
      test: 'tester',
      obj: {},
    };
    expect(
      hasStateChanged(stores, oldState, {
        testStore: 'aipwhegpaiwhr',
        test: 'testing',
        obj: oldState.obj,
      })
    ).toBe(true);
    expect(
      hasStateChanged(stores, oldState, {
        testStore: 'random',
        test: 'tester',
        obj: {},
      })
    ).toBe(true);
    expect(
      hasStateChanged(stores, oldState, {
        testStore: 'oaihwregoaw',
        test: 'tester',
        obj: oldState.obj,
      })
    ).toBe(false);
    oldState.obj.field = 'blah';
    expect(
      hasStateChanged(stores, oldState, {
        testStore: 'oaihwregoaw',
        test: 'tester',
        obj: oldState.obj,
      })
    ).toBe(false);
  });

  it('merges state', () => {
    expect(
      merge({
        one: 1,
        two: 'two',
      }, {
        two: 2,
        three: 3,
      })
    ).toEqual({
      one: 1,
      two: 2,
      three: 3,
    });
  });

});
