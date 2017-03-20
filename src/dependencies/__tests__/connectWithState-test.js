jest.disableAutomock();
import connectWithState from '../connectWithState';
import { Dispatcher } from 'flux';
import { mount, shallow } from 'enzyme';
import React, { PropTypes } from 'react';
import StoreFactory from '../../store/StoreFactory';

function BaseComponent() {
  return <div />;
}

const stateType = PropTypes.shape({
  testing: PropTypes.bool.isRequired,
}).isRequired;

BaseComponent.displayName = 'BaseComponent';
BaseComponent.propTypes = {
  initialState: stateType,
  otherProp: PropTypes.any,
  state: stateType,
};
BaseComponent.testStaticMethod = () => true;

describe('connect', () => {
  const defaultInitialState = { testing: true };

  const FIRST_ONLY = 'FIRST_ONLY';
  const SHARED = 'SHARED';
  const FirstStoreFactory = new StoreFactory({})
    .defineGet(state => state)
    .defineGetInitialState(() => 1)
    .defineResponses({
      [FIRST_ONLY]: state => state + 1,
      [SHARED]: state => state - 1,
    });

  let dispatcher;
  let dependencies;
  let FirstStore;
  let MockComponent;

  beforeEach(() => {
    dispatcher = new Dispatcher();
    dispatcher.register = jest.fn(dispatcher.register);
    dispatcher.unregister = jest.fn(dispatcher.unregister);
    dispatcher.waitFor = jest.fn(dispatcher.waitFor);
    FirstStore = FirstStoreFactory.register(dispatcher);
    dependencies = {
      one: {
        stores: [FirstStore],
        deref: () => FirstStore.get(),
      },
    };
    MockComponent = connectWithState(
      defaultInitialState,
      dependencies,
      dispatcher
    )(BaseComponent);
  });

  describe('propTypes', () => {
    it('exports propTypes with initialState and without state & setState', () => {
      expect(MockComponent.propTypes).toEqual({
        initialState: PropTypes.object,
        otherProp: PropTypes.any,
      });
    });

    it('adds an optional initialState', () => {
      function NoInitialStateComponent() {
        return <div />;
      }
      NoInitialStateComponent.propTypes = {};
      const WrappedComponent = connectWithState({}, dependencies, dispatcher)(
        NoInitialStateComponent
      );
      expect(WrappedComponent.propTypes).toEqual({
        initialState: PropTypes.object,
      });
    });
  });

  describe('statics', () => {
    it('exports dependencies', () => {
      expect(MockComponent.dependencies).toEqual(dependencies);
    });

    it('exports WrappedComponent', () => {
      expect(MockComponent.WrappedComponent).toEqual(BaseComponent);
    });

    it('generates a proper displayName', () => {
      expect(MockComponent.displayName).toBe(
        'Stateful(Connected(BaseComponent))'
      );
    });

    it('passes any statics through to ConnectedComponent', () => {
      expect(typeof MockComponent.testStaticMethod).toBe('function');
      expect(MockComponent.testStaticMethod).toBe(
        BaseComponent.testStaticMethod
      );
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
      const ConnectedComponentWithFocus = connectWithState(
        defaultInitialState,
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

  describe('initialState', () => {
    it('passes defaultInitialState if no initialState is specified', () => {
      const rendered = shallow(<MockComponent />);
      expect(rendered.prop('initialState')).toEqual(defaultInitialState);
    });

    it('passes initialState if it is specified', () => {
      const initialState = { testing: false };
      const rendered = shallow(<MockComponent initialState={initialState} />);
      expect(rendered.prop('initialState')).toEqual(initialState);
    });
  });

  describe('state', () => {
    it('updates state', () => {
      const rendered = shallow(<MockComponent />);
      expect(rendered.prop('state')).toEqual(defaultInitialState);
      rendered.prop('setState')({ testing: false });
      expect(rendered.prop('state')).toEqual({ testing: false });
    });
  });
});
