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
    FirstStore = FirstStoreFactory.register(dispatcher);
    SecondStore = SecondStoreFactory.register(dispatcher);
    dependencies = {
      one: FirstStore,
      two: {
        propTypes: {
          add: PropTypes.number,
        },
        stores: [SecondStore],
        deref: ({add}) => SecondStore.get(add || 0),
      },
    };
    mixin = StoreDependencyMixin(dependencies, dispatcher);
    MockComponent = React.createClass({
      mixins: [mixin],
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
      expect(StoreDependencyMixin({one: FirstStore}).propTypes).toEqual({});
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
      });
    });

    it('doesnt recalculate fields that dont use props');
  });

  describe('componentDidUpdate', () => {
    it('has a componentDidUpdate if a field uses state');

    it('bails out if only store state changed');

    it('only recalculates fields that use state');
  });

  describe('handleDispatch', () => {
    it('waits for all stores affected by the actionType');

    it('only updates fields affected by the actionType');
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
