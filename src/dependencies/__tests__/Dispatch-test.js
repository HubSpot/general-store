jest.unmock('../Dispatch');
import { handleDispatch } from '../Dispatch';
import { Dispatcher } from 'flux';

describe('Dispatch', () => {
  const TEST_ACTION = 'TEST_ACTION';
  const UNKNOWN_ACTION = 'UNKNOWN_ACTION';
  const mockIndex = {
    [TEST_ACTION]: {
      dispatchTokens: {
        'ID_1': true,
        'ID_2': true,
      },
      fields: {
        'one': true,
        'two': true,
      },
    },
  };

  let dispatcher;
  let mockThen;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    mockThen = jest.fn();
  });

  describe('handleDispatch', () => {
    it('does nothing if the `actionType` is not in the index', () => {
      handleDispatch(dispatcher, mockIndex, mockThen, {
        actionType: UNKNOWN_ACTION,
      });
      expect(dispatcher.waitFor.mock.calls.length).toBe(0);
      expect(mockThen.mock.calls.length).toBe(0);
    });

    it('waits for dispatchTokens', () => {
      handleDispatch(dispatcher, mockIndex, mockThen, {
        actionType: TEST_ACTION,
      });
      expect(
        dispatcher.waitFor.mock.calls[0][0]
      ).toEqual(
        Object.keys(mockIndex[TEST_ACTION].dispatchTokens)
      );
    });

    it('calls `then` with the `entry`', () => {
      handleDispatch(dispatcher, mockIndex, mockThen, {
        actionType: TEST_ACTION,
      });
      expect(
        mockThen.mock.calls[0][0]
      ).toBe(
        mockIndex[TEST_ACTION]
      );
    });
  });
});
