jest.disableAutomock();
import { Dispatcher } from 'flux';
import { shallow } from 'enzyme';
import React, { PropTypes } from 'react';
import StoreDependencyMixin from '../StoreDependencyMixin';
import StoreFactory from '../../store/StoreFactory';

describe('StoreDependencyMixin', () => {
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
  let mixin;
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
        deref: (props, state) => {
          const localCount = state ? state.localCount : 0;
          return (
            FirstStore.get() +
            SecondStore.get(props.add || 0) +
            localCount
          );
        }
      }
    };
    mixin = StoreDependencyMixin(dependencies, dispatcher);
    MockComponent = React.createClass({
      mixins: [mixin],
      getInitialState() {
        return {
          localCount: 0,
        };
      },

      render() {
        return <div />;
      },
    });
  });

  describe('propTypes', () => {
    it('has propTypes if a dependency specifices them', () => {
      expect(
        mixin.propTypes
      ).toEqual({
        add: PropTypes.number
      });
    });

    it('doesnt have propTypes if no deps specify them', () => {
      expect(
        StoreDependencyMixin(
          {one: FirstStore},
          dispatcher
        ).propTypes
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
        localCount: 0,
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
        localCount: 0,
        one: 1,
        two: 4,
        third: 5,
      });
    });
  });

  describe('componentDidUpdate', () => {
    it('has a componentDidUpdate if a field uses state', () => {
      expect(
        StoreDependencyMixin({
          one: FirstStore,
        }, dispatcher).componentDidUpdate
      ).toBe(undefined);
    });

    it('recalculates fields that use state', () => {
      const root = shallow(<MockComponent />);
      root.setState({localCount: 2});
      expect(root.state()).toEqual({
        localCount: 2,
        one: 1,
        two: 2,
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
        localCount: 0,
        one: 0,
        two: 1,
        third: 1,
      });
    });
  });

  describe('componentWillUnmount', () => {
    it('unregisters its dispatcher callback', () => {
      const root = shallow(<MockComponent />);
      const dispatchToken = root.instance().__dispatchToken;
      root.unmount();
      expect(dispatcher.unregister.mock.calls[0][0]).toBe(dispatchToken);
    });
  });
});
