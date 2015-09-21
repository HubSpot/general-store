jest.dontMock('../DispatcherInterface.js');

describe('DispatcherInterface', () => {

  let DispatcherInterface;

  beforeEach(() => {
    DispatcherInterface = require('../DispatcherInterface.js');
  });

  it('correctly validates a dispatcher', () => {
    expect(DispatcherInterface.isDispatcher({})).toBe(false);
    expect(DispatcherInterface.isDispatcher({
      register: function() {},
    })).toBe(false);
    expect(DispatcherInterface.isDispatcher({
      unregister: function() {},
    })).toBe(false);

    expect(DispatcherInterface.isDispatcher({
      register: function() {},
      unregister: function() {},
    })).toBe(true);
  });

  it('correctly validates a payload', () => {
    expect(DispatcherInterface.isPayload(null)).toBe(false);
    expect(DispatcherInterface.isPayload({})).toBe(false);
    expect(DispatcherInterface.isPayload({
      actionType: 1124,
      data: {},
    })).toBe(false);
    expect(DispatcherInterface.isPayload({
      actionType: 'ACTION',
    })).toBe(true);
    expect(DispatcherInterface.isPayload({
      actionType: 'ACTION',
      data: null,
    })).toBe(true);
  });

});
