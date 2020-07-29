/* eslint-disable react-app/react/forbid-foreign-prop-types */
jest.disableAutomock();
import { Dispatcher } from 'flux';
import { mount, shallow, configure } from 'enzyme';
import { getDispatchToken } from '../../store/InspectStore';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import connect from '../connect';
import StoreFactory from '../../store/StoreFactory';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });

function BaseComponent() {
  return <div />;
}

BaseComponent.displayName = 'BaseComponent';
BaseComponent.testStaticMethod = () => true;

describe('connect', () => {
  const FIRST_ONLY = 'FIRST_ONLY';
  const SECOND_ONLY = 'SECOND_ONLY';
  const SHARED = 'SHARED';
  const FirstStoreFactory = new StoreFactory({})
    .defineGet(state => state)
    .defineGetInitialState(() => 1)
    .defineResponses({
      [FIRST_ONLY]: state => state + 1,
      [SHARED]: state => state - 1,
    });
  const SecondStoreFactory = new StoreFactory({})
    .defineGet((state, add) => state + add)
    .defineGetInitialState(() => 2)
    .defineResponses({
      [SECOND_ONLY]: state => state + 1,
      [SHARED]: state => state - 1,
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
        deref: props => SecondStore.get(props.add || 0),
      },
      third: {
        stores: [FirstStore, SecondStore],
        deref: (props, state) => {
          return state.one + SecondStore.get(props.add || 0);
        },
      },
    };
    MockComponent = connect(
      dependencies,
      dispatcher
    )(BaseComponent);
  });

  describe('statics', () => {
    it('exports dependencies', () => {
      expect(MockComponent.dependencies).toEqual(dependencies);
    });

    it('exports WrappedComponent', () => {
      expect(MockComponent.WrappedComponent).toEqual(BaseComponent);
    });

    it('generates a proper displayName', () => {
      expect(MockComponent.displayName).toBe('Connected(BaseComponent)');
    });

    it('passes any statics through to ConnectedComponent', () => {
      expect(typeof MockComponent.testStaticMethod).toBe('function');
      expect(MockComponent.testStaticMethod).toBe(
        BaseComponent.testStaticMethod
      );
    });
  });

  describe('propTypes', () => {
    it('has propTypes if a dependency specifices them', () => {
      expect(MockComponent.propTypes).toEqual({
        add: PropTypes.number,
      });
    });

    it('doesnt have propTypes if no deps specify them', () => {
      expect(
        connect(
          { one: FirstStore },
          dispatcher
        )(BaseComponent).propTypes
      ).toEqual({});
    });
  });

  describe('on mount', () => {
    it('registers a callback with the dispatcher', () => {
      let root;
      act(() => {
        root = mount(<MockComponent />);
      });
      expect(dispatcher.register.mock.calls.length).toEqual(3);
      root.unmount();
    });

    it('calculates and sets initial state', () => {
      let root;
      act(() => {
        root = mount(<MockComponent />);
      });
      expect(root.find(BaseComponent).props()).toEqual({
        one: 1,
        two: 2,
        third: 3,
      });
    });
  });

  describe('complex dependency results', () => {
    it('prevents infinite loops with incorrectly diffed results', () => {
      const simpleArraysStore = new StoreFactory({})
        .defineGet(state => state)
        .defineGetInitialState(() => [1, 2, 3, 4, 5])
        .register(dispatcher);
      const complexArraysStore = new StoreFactory({})
        .defineGet(state => state)
        .defineGetInitialState(() => [
          { top: 'test', top2: [1, 2, 3], top3: { deep: 'test', deep2: 1234 } },
          {
            top: 'test2',
            top2: [4, 5, 6],
            top3: { deep: 'test2', deep2: 2468 },
          },
        ])
        .register(dispatcher);
      MockComponent = connect(
        {
          simpleArraysStore,
          complexArraysStore,
          merged: {
            stores: [simpleArraysStore, complexArraysStore],
            deref(__, depMap) {
              console.log(depMap);
              return (
                depMap.simpleArraysStore &&
                depMap.simpleArraysStore.concat(depMap.complexArraysStore)
              );
            },
          },
        },
        dispatcher
      )(BaseComponent);
      let root;
      act(() => {
        root = mount(<MockComponent />);
      });
      // would not get here if array diffing wasn't working properly
      expect(root.find(BaseComponent).exists()).toBe(true);
    });
  });

  describe('when props change', () => {
    it('calculates and sets state', () => {
      let root;
      act(() => {
        root = mount(<MockComponent />);
        root.setProps({ add: 2 });
      });
      act(() => {
        root.update();
      });
      expect(root.find(BaseComponent).props()).toEqual({
        add: 2,
        one: 1,
        two: 4,
        third: 5,
      });
      root.unmount();
    });
  });

  describe('on dispatch', () => {
    it('waits for all stores affected by the actionType', () => {
      let root;
      act(() => {
        root = mount(<MockComponent />);
      });
      act(() => {
        dispatcher.dispatch({ actionType: SHARED });
      });
      act(() => {
        root.update();
      });
      expect(dispatcher.waitFor).toHaveBeenCalledWith([
        getDispatchToken(FirstStore),
        getDispatchToken(SecondStore),
      ]);
    });

    it('only updates fields affected by the actionType', () => {
      const root = mount(<MockComponent />);
      dispatcher.dispatch({ actionType: SHARED });
      act(() => {
        root.update();
      });
      expect(root.find(BaseComponent).props()).toEqual({
        one: 0,
        two: 1,
        third: 1,
      });
    });
  });

  describe('on unmount', () => {
    it('unregisters its dispatcher callback', () => {
      let root;
      act(() => {
        root = mount(<MockComponent />);
      });
      act(() => {
        root.unmount();
      });
      expect(dispatcher.unregister).toHaveBeenCalled();
    });
  });
});
