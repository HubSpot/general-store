jest.dontMock('../EventHandler.js');

describe('EventHandler', () => {
  let Event;
  let EventHandler;

  beforeEach(() => {
    Event = require('../Event.js');
    EventHandler = require('../EventHandler.js');
  });

  it('calls removeHandler only once on instance when remove is called', () => {
    const mockEvent = new Event();
    const mockKey = 1234;
    const handler = new EventHandler(mockEvent, mockKey);
    handler.remove();
    expect(mockEvent.removeHandler.mock.calls.length).toBe(1);
    expect(mockEvent.removeHandler.mock.calls[0][0]).toBe(mockKey);
    handler.remove();
    handler.remove();
    handler.remove();
    expect(mockEvent.removeHandler.mock.calls.length).toBe(1);
  });
});
