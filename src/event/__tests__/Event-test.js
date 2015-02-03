jest.dontMock('../Event.js');

describe('Event', () => {

  var Event;
  var EventHandler;

  var eventInstance;

  beforeEach(() => {
    Event = require('../Event.js');
    EventHandler = require('../EventHandler.js');

    eventInstance = new Event();
  });

  it('runs all handler callbacks on runHandlers', () => {
    var mockCallback = jest.genMockFunction();
    var otherMockCallback = jest.genMockFunction();
    eventInstance.addHandler(mockCallback);
    eventInstance.addHandler(otherMockCallback);
    eventInstance.runHandlers();
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(otherMockCallback.mock.calls.length).toBe(1);
    eventInstance.runHandlers();
    eventInstance.runHandlers();
    eventInstance.runHandlers();
    expect(mockCallback.mock.calls.length).toBe(4);
    expect(otherMockCallback.mock.calls.length).toBe(4);
  });

  it('does not run handlers that have been removed', () => {
    var mockCallback = jest.genMockFunction();
    eventInstance.addHandler(mockCallback);
    eventInstance.runHandlers();
    expect(mockCallback.mock.calls.length).toBe(1);
    eventInstance.removeHandler(EventHandler.mock.calls[0][1]);
    eventInstance.runHandlers();
    expect(mockCallback.mock.calls.length).toBe(1);
  });

  it('runs handlers for multiple events using runMutliple', () => {
    var otherEventInstance = new Event();
    var mockCallback = jest.genMockFunction();
    var otherMockCallback = jest.genMockFunction();
    eventInstance.addHandler(mockCallback);
    otherEventInstance.addHandler(otherMockCallback);
    Event.runMultiple([eventInstance, otherEventInstance]);
    expect(mockCallback.mock.calls.length).toBe(1);
    expect(otherMockCallback.mock.calls.length).toBe(1);
    Event.runMultiple([eventInstance, otherEventInstance]);
    Event.runMultiple([eventInstance, otherEventInstance]);
    Event.runMultiple([eventInstance, otherEventInstance]);
    expect(mockCallback.mock.calls.length).toBe(4);
    expect(otherMockCallback.mock.calls.length).toBe(4);
  });

  it('does not run handlers after the event has been removed', () => {
    var mockCallback = jest.genMockFunction();
    eventInstance.addHandler(mockCallback);
    eventInstance.runHandlers();
    expect(mockCallback.mock.calls.length).toBe(1);
    eventInstance.remove();
    eventInstance.runHandlers();
    expect(mockCallback.mock.calls.length).toBe(1);
  });
});
