jest.disableAutomock();
import { Dispatcher } from 'flux';
import { shallow } from 'enzyme';
import React, { PropTypes } from 'react';
import connect from '../connect';
import StoreFactory from '../../store/StoreFactory';

function BaseComponent() {
  return <div />;
}

describe('connect', () => {
  const FIRST_ONLY = 'FIRST_ONLY';
  const SECOND_ONLY = 'SECOND_ONLY';
  const SHARED = 'SHARED';
  const FirstStoreFactory = new StoreFactory({})
    .defineGet((state) => state)
    .defineGetInitialState(() => 1)
    .defineResponses({
      [FIRST_ONLY]: (state) => state + 1,
      [SHARED]: (state) => state - 1,
    });
  const SecondStoreFactory = new StoreFactory({})
    .defineGet((state, add) => state + add)
    .defineGetInitialState(() => 2)
    .defineResponses({
      [SECOND_ONLY]: (state) => state + 1,
      [SHARED]: (state) => state - 1,
    });

  let dispatcher;
  let FirstStore;
  let SecondStore;
  let dependencies;
  let MockComponent;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    dispatcher.register = jest.fn(dispatcher.register);
    dispatcher.unregister = jest.fn(dispatcher.unregister);
    dispatcher.waitFor = jest.fn(dispatcher.waitFor);
    FirstStore = FirstStoreFactory.register(dispatcher);
    SecondStore = SecondStoreFactory.register(dispatcher);
    dependencies = {
      one: {
        stores: [FirstStore],
        deref: () => FirstStore.get(),
      },
      two: {
        propTypes: {
          add: PropTypes.number,
        },
        stores: [SecondStore],
        deref: (props) => SecondStore.get(props.add || 0),
      },
      third: {
        stores: [FirstStore, SecondStore],
        deref: (props) => {
          return FirstStore.get() + SecondStore.get(props.add || 0);
        }
      }
    };
    MockComponent = connect(dependencies, dispatcher)(BaseComponent);
  });

  describe('propTypes', () => {
    it('has propTypes if a dependency specifices them', () => {
      expect(
        MockComponent.propTypes
      ).toEqual({
        add: PropTypes.number
      });
    });

    it('doesnt have propTypes if no deps specify them', () => {
      expect(
        connect({one: FirstStore}, dispatcher)(BaseComponent).propTypes
      ).toEqual({});
    });
  });

  describe('componentWillMount', () => {
    it('registers a callback with the dispatcher', () => {
      shallow(<MockComponent />);
      expect(dispatcher.register.mock.calls.length).toEqual(3);
    });

    it('calculates and sets initial state', () => {
      const root = shallow(<MockComponent />);
      expect(root.state()).toEqual({
        one: 1,
        two: 2,
        third: 3,
      });
    });
  });

  describe('componentWillReceiveProps', () => {
    it('calculates and sets state', () => {
      const root = shallow(<MockComponent />);
      root.setProps({add: 2});
      expect(root.state()).toEqual({
        one: 1,
        two: 4,
        third: 5,
      });
    });
  });

  describe('handleDispatch', () => {
    it('waits for all stores affected by the actionType', () => {
      shallow(<MockComponent />);
      dispatcher.dispatch({actionType: SHARED});
      expect(dispatcher.waitFor.mock.calls[0][0]).toEqual([
        FirstStore.getDispatchToken(),
        SecondStore.getDispatchToken(),
      ]);
    });

    it('only updates fields affected by the actionType', () => {
      const root = shallow(<MockComponent />);
      dispatcher.dispatch({actionType: SHARED});
      expect(root.state()).toEqual({
        one: 0,
        two: 1,
        third: 1,
      });
    });
  });

  describe('componentWillUnmount', () => {
    it('unregisters its dispatcher callback', () => {
      const root = shallow(<MockComponent />);
      const dispatchToken = root.instance().dispatchToken;
      root.unmount();
      expect(dispatcher.unregister.mock.calls[0][0]).toBe(dispatchToken);
    });
  });
});
