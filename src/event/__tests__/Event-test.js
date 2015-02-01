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

});
