jest.unmock('../DispatcherInterface.js');

describe('DispatcherInterface', () => {
  let DispatcherInterface;

  beforeEach(() => {
    DispatcherInterface = require('../DispatcherInterface.js');
  });

  it('correctly validates a dispatcher', () => {
    expect(DispatcherInterface.isDispatcher({})).toBe(false);
    expect(DispatcherInterface.isDispatcher({
      register() {},
    })).toBe(false);
    expect(DispatcherInterface.isDispatcher({
      unregister() {},
    })).toBe(false);

    expect(DispatcherInterface.isDispatcher({
      register() {},
      unregister() {},
    })).toBe(true);
  });

  it('correctly validates a payload with actionType/data', () => {
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

  it('correctly validates a payload with type/payload structure', () => {
    expect(DispatcherInterface.isPayload(null)).toBe(false);
    expect(DispatcherInterface.isPayload({})).toBe(false);
    expect(DispatcherInterface.isPayload({
      type: 1124,
      payload: {},
    })).toBe(false);
    expect(DispatcherInterface.isPayload({
      type: 'ACTION',
    })).toBe(true);
    expect(DispatcherInterface.isPayload({
      type: 'ACTION',
      payload: null,
    })).toBe(true);
  });
});
