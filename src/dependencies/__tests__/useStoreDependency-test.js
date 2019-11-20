jest.disableAutomock();
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import StoreFactory from '../../store/StoreFactory';
import * as React from 'react';
import useStoreDependency from '../useStoreDependency';
import { Dispatcher } from 'flux';
import { set as setDispatcherInstance } from '../../dispatcher/DispatcherInstance';
import TestUtils from 'react-dom/test-utils';
import { List, Map } from 'immutable';

configure({ adapter: new Adapter() });

function MockComponent({ callback, ...rest }) {
  callback(rest);
  return null;
}

function testHook(callback) {
  return shallow(<MockComponent callback={callback} />);
}

describe('useStoreDependency', () => {
  const INCREMENT = 'INCREMENT';
  const INCREMENT_2 = 'INCREMENT_2';
  const BaseStoreFactory = new StoreFactory({})
    .defineGet(state => state)
    .defineGetInitialState(() => 1)
    .defineResponses({
      [INCREMENT]: state => state + 1,
    });
  const dispatcher = new Dispatcher();
  setDispatcherInstance(dispatcher);

  it('returns the initial store value with no props', () => {
    const useCallback = () => {
      const firstValue = useStoreDependency(
        BaseStoreFactory.register(dispatcher)
      );
      expect(firstValue).toBe(1);
    };
    testHook(useCallback);
  });

  describe('store updates', () => {
    let store;

    beforeEach(() => {
      store = BaseStoreFactory.register(dispatcher);
    });

    it('responds to updates with a simple dependency', () => {
      const Component = () => {
        const value1 = useStoreDependency(store);
        return <div data-value={value1} />;
      };
      const rendered = mount(<Component />);
      expect(rendered.find('div').prop('data-value')).toBe(1);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      rendered.update();
      expect(rendered.find('div').prop('data-value')).toBe(2);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      rendered.update();
      expect(rendered.find('div').prop('data-value')).toBe(4);
    });

    it('responds to updates with a complex dependency', () => {
      const store2 = BaseStoreFactory.defineResponseTo(
        INCREMENT_2,
        state => state + 1
      ).register(dispatcher);
      const Component = () => {
        const value1 = useStoreDependency({
          stores: [store, store2],
          deref() {
            return store.get() * store2.get();
          },
        });
        return <div data-value={value1} />;
      };
      const rendered = mount(<Component />);
      expect(rendered.find('div').prop('data-value')).toBe(1);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      rendered.update();
      expect(rendered.find('div').prop('data-value')).toBe(4);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      rendered.update();
      expect(rendered.find('div').prop('data-value')).toBe(9);
    });

    it('responds to updates with a complex dependency with props', () => {
      const store2 = BaseStoreFactory.defineResponseTo(
        INCREMENT_2,
        state => state + 1
      ).register(dispatcher);
      const Component = ({ factor }) => {
        const value1 = useStoreDependency(
          {
            stores: [store, store2],
            deref({ factor }) {
              return store.get() * store2.get() * factor;
            },
          },
          { factor }
        );
        return <div data-value={value1} />;
      };
      const rendered = mount(<Component factor={2} />);
      expect(rendered.find('div').prop('data-value')).toBe(2);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      rendered.update();
      expect(rendered.find('div').prop('data-value')).toBe(8);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT_2 });
      });
      rendered.update();
      expect(rendered.find('div').prop('data-value')).toBe(12);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      rendered.update();
      expect(rendered.find('div').prop('data-value')).toBe(24);
    });

    it("doesn't trigger an update if deref value is strictly equal", () => {
      const DO_NOTHING = 'DO_NOTHING';
      const store = BaseStoreFactory.defineResponseTo(
        DO_NOTHING,
        state => state
      ).register();
      let renders = 0;
      const countRender = () => (renders += 1);
      const Component = () => {
        useStoreDependency(store);
        countRender();
        return null;
      };
      const rendered = mount(<Component />);
      expect(renders).toBe(1);
      TestUtils.act(() => {
        dispatcher.dispatch({ actionType: INCREMENT });
      });
      rendered.update();
      expect(renders).toBe(2);
      // shouldn't trigger a state update, shouldn't need to be in an `act`
      dispatcher.dispatch({ actionType: DO_NOTHING });
      rendered.update();
      expect(renders).toBe(2);
    });

    it("doesn't trigger an infinite loop when using immutable objects", () => {
      const store = new StoreFactory({
        getter: state => state,
        getInitialState: () => List([Map({ a: 1 })]),
        responses: {
          updateImmutable: (state, newValue) => newValue,
        },
      }).register();
      const Component = () => {
        useStoreDependency({
          stores: [store],
          deref: () => List([Map({ a: 5 })]),
        });

        return null;
      };
      mount(<Component />);
      // no assertions to make, but this test will fail if equality is
      // not implemented correctly, as the immutables will not be strictly
      // equal, sending useStoreDependency into an infinite loop
      // https://github.com/HubSpot/general-store/issues/74
      expect(true).toBe(true);
    });
  });

  describe('with props', () => {
    let store;
    let multiplyDependency;

    beforeEach(() => {
      store = BaseStoreFactory.register(dispatcher);
      multiplyDependency = {
        stores: [store],
        deref: ({ factor }) => {
          if (!factor) throw new Error('no factor provided');
          return store.get() * factor;
        },
      };
    });

    it('returns the initial store value', () => {
      const useCallback = () => {
        const firstValue = useStoreDependency(multiplyDependency, {
          factor: 4,
        });
        expect(firstValue).toBe(4);
      };
      testHook(useCallback);
    });

    it('handles a prop update', () => {
      const Component = ({ factor = 4 }) => {
        const value = useStoreDependency(multiplyDependency, { factor });
        return <div data-factor={value} />;
      };
      const rendered = shallow(<Component />);
      expect(rendered.find('div').prop('data-factor')).toBe(4);
      rendered.setProps({ factor: 8 });
      rendered.update();
      expect(rendered.find('div').prop('data-factor')).toBe(8);
    });

    it('handles an internal prop update', () => {
      const Component = () => {
        const [factor, setFactor] = React.useState(4);
        const value = useStoreDependency(multiplyDependency, { factor });
        return (
          <div data-factor={value} onClick={() => setFactor(factor * 2)} />
        );
      };
      const rendered = mount(<Component />);
      expect(rendered.find('div').prop('data-factor')).toBe(4);
      rendered.find('div').simulate('click');
      rendered.update();
      expect(rendered.find('div').prop('data-factor')).toBe(8);
      rendered.find('div').simulate('click');
      rendered.update();
      expect(rendered.find('div').prop('data-factor')).toBe(16);
    });
  });
});
