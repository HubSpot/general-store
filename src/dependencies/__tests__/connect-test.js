jest.disableAutomock();
import { Dispatcher } from 'flux';
import { mount, shallow, configure } from 'enzyme';
import { getDispatchToken } from '../../store/InspectStore';
import * as React from 'react';
import * as PropTypes from 'prop-types';
import connect from '../connect';
import StoreFactory from '../../store/StoreFactory';
import Adapter from 'enzyme-adapter-react-16';

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
        deref: props => {
          return FirstStore.get() + SecondStore.get(props.add || 0);
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
      root.setProps({ add: 2 });
      expect(root.state()).toEqual({
        one: 1,
        two: 4,
        third: 5,
      });
    });
  });

  describe('focus', () => {
    it('is undefined if BaseComponent has no focus method', () => {
      expect(MockComponent.focus).toBe(undefined);
    });

    it('calls through to the BaseComponents focus', () => {
      const focusSpy = jest.fn();
      class ComponentWithFocus extends React.Component {
        focus(...args) {
          return focusSpy(...args);
        }

        render() {
          return <div />;
        }
      }
      const ConnectedComponentWithFocus = connect(
        dependencies,
        dispatcher
      )(ComponentWithFocus);
      const rendered = mount(<ConnectedComponentWithFocus />);
      const connectedInstance = rendered.instance();
      connectedInstance.focus('test', 123);
      expect(focusSpy.mock.calls.length).toBe(1);
      expect(focusSpy.mock.calls[0]).toEqual(['test', 123]);
    });
  });

  describe('handleDispatch', () => {
    it('waits for all stores affected by the actionType', () => {
      shallow(<MockComponent />);
      dispatcher.dispatch({ actionType: SHARED });
      expect(dispatcher.waitFor.mock.calls[0][0]).toEqual([
        getDispatchToken(FirstStore),
        getDispatchToken(SecondStore),
      ]);
    });

    it('only updates fields affected by the actionType', () => {
      const root = shallow(<MockComponent />);
      dispatcher.dispatch({ actionType: SHARED });
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
