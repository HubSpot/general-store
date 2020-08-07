import {
  DependencyMap,
  DependencyMapProps,
  GetProps,
  ConnectedComponentType,
  calculateInitial,
  calculate,
} from './DependencyMap';
import { Dispatcher } from 'flux';
import { makeDisplayName } from './BuildComponent';
import { dependencyPropTypes } from '../dependencies/DependencyMap';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { enforceDispatcher } from '../dispatcher/DispatcherInterface';
import * as React from 'react';
import { ComponentType, forwardRef, RefObject, useRef, useState } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { _useDispatchSubscription } from './useStoreDependency';
import { shallowEqual, oMap } from '../utils/ObjectUtils';

export function useCurrent<ValueType>(value: ValueType): RefObject<ValueType> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export default function connect<Deps extends DependencyMap>(
  dependencies: Deps,
  dispatcher: Dispatcher<any> = getDispatcherInstance()
) {
  enforceDispatcher(dispatcher);

  return function connector<
    C extends any,
    Props extends DependencyMapProps<Deps>
  >(BaseComponent: ComponentType<Props>): ConnectedComponentType<Props, C> {
    const ConnectedComponent: ConnectedComponentType<Props & C, C> = forwardRef(
      (props: GetProps<C>, ref) => {
        enforceDispatcher(dispatcher);

        const [dependencyValue, setDependencyValue] = useState(
          () => calculateInitial(dependencies, props, {}) || {}
        );

        const currProps = useCurrent(props);

        _useDispatchSubscription(
          dependencies,
          currProps,
          dispatcher,
          dependencyValue,
          setDependencyValue
        );

        const newValue = oMap(dependencies, dep =>
          calculate(dep, props, dependencyValue)
        );
        if (
          Object.keys(newValue)
            .map(k => shallowEqual(newValue[k], dependencyValue[k]))
            .some(el => el === false)
        ) {
          setDependencyValue(newValue as typeof dependencyValue);
        }

        // TypeScript really doesn't like how I'm typing the output here
        // @ts-ignore
        return <BaseComponent {...props} {...dependencyValue} ref={ref} />;
      }
    );

    ConnectedComponent.defaultProps = BaseComponent.defaultProps;
    ConnectedComponent.dependencies = dependencies as Deps;
    ConnectedComponent.displayName = makeDisplayName(
      'Connected',
      BaseComponent
    );
    ConnectedComponent.propTypes = dependencyPropTypes(
      dependencies,
      BaseComponent.propTypes
    );
    ConnectedComponent.WrappedComponent = BaseComponent;

    return hoistStatics(ConnectedComponent, BaseComponent);
  };
}
