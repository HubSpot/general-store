import {
  DependencyMap,
  DependencyMapProps,
  ConnectedComponentType,
  calculateInitial,
  calculateForDispatch,
  makeDependencyIndex,
  DependencyIndexEntry,
} from './DependencyMap';
import { Dispatcher } from 'flux';
import { makeDisplayName, focuser } from './BuildComponent';
import { dependencyPropTypes } from '../dependencies/DependencyMap';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { enforceDispatcher } from '../dispatcher/DispatcherInterface';
import * as React from 'react';
import { ComponentType, RefObject, useRef } from 'react';
import hoistStatics from 'hoist-non-react-statics';
import { handleDispatch } from './Dispatch';

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

  const dependencyIndex = makeDependencyIndex(dependencies);

  return function connector<
    C extends any,
    Props extends DependencyMapProps<Deps>
  >(BaseComponent: ComponentType<Props>): ConnectedComponentType<Props, C> {
    class ConnectedComponent extends React.Component<Props, any> {
      static defaultProps?: Partial<Props> = BaseComponent.defaultProps;
      static dependencies: Deps = dependencies;
      static displayName = makeDisplayName('Connected', BaseComponent);
      static propTypes: any = dependencyPropTypes(
        dependencies,
        // eslint-disable-next-line react-app/react/forbid-foreign-prop-types
        BaseComponent.propTypes
      );
      static WrappedComponent: ComponentType<Props> = BaseComponent;

      static getDerivedStateFromProps(props: unknown, state: unknown) {
        return calculateInitial(dependencies, props, state);
      }

      dispatchToken?: string;
      state: any = {};
      wrappedInstance?: HTMLElement = null;

      constructor(props: Props) {
        super(props);
        if (dispatcher) {
          this.dispatchToken = dispatcher.register(
            handleDispatch.bind(
              null,
              dispatcher,
              dependencyIndex,
              this.handleDispatch.bind(this)
            )
          );
        }
        this.state = calculateInitial(dependencies, this.props, {});
      }

      componentWillUnmount() {
        const dispatchToken = this.dispatchToken;
        if (dispatcher && dispatchToken) {
          this.dispatchToken = null;
          dispatcher.unregister(dispatchToken);
        }
      }

      handleDispatch(entry: DependencyIndexEntry) {
        this.setState(
          calculateForDispatch(dependencies, entry, this.props, this.state)
        );
      }

      focus =
        typeof BaseComponent.prototype.focus === 'function'
          ? (...args: any[]) => focuser(this, ...args)
          : undefined;

      setWrappedInstance = (ref: HTMLElement) => {
        this.wrappedInstance = ref;
      };

      render() {
        const refProps =
          typeof BaseComponent === 'function'
            ? {}
            : { ref: this.setWrappedInstance };
        return <BaseComponent {...this.props} {...this.state} {...refProps} />;
      }
    }

    return hoistStatics(ConnectedComponent, BaseComponent);
  };
}
