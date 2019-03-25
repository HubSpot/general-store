jest.disableAutomock();

import Event from '../Event';
import EventHandler from '../EventHandler';

describe('EventHandler', () => {
  it('calls removeHandler only once on instance when remove is called', () => {
    const mockEvent = new Event();
    jest.spyOn(mockEvent, 'removeHandler');
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
