jest.dontMock('../EventHandler.js');

describe('EventHandler', () => {

  var Event;
  var EventHandler;

  beforeEach(() => {
    Event = require('../Event.js');
    EventHandler = require('../EventHandler.js');
  });

  it('calls removeHandler only once on instance when remove is called', () => {
    var mockEvent = new Event();
    var mockKey = 1234;
    var handler = new EventHandler(mockEvent, mockKey);
    handler.remove();
    expect(mockEvent.removeHandler.mock.calls.length).toBe(1);
    expect(mockEvent.removeHandler.mock.calls[0][0]).toBe(mockKey);
    handler.remove();
    handler.remove();
    handler.remove();
    expect(mockEvent.removeHandler.mock.calls.length).toBe(1);
  });

});
