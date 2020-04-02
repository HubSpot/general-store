import * as React from 'react';
import {
  Dependency,
  calculate,
  calculateForDispatch,
  makeDependencyIndex,
  DependencyIndexEntry,
} from './DependencyMap';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { enforceDispatcher } from '../dispatcher/DispatcherInterface';
import { handleDispatch } from './Dispatch';
import { Dispatcher } from 'flux';
import { shallowEqual } from '../utils/ObjectUtils';
// import StoreFactory from '../store/StoreFactory';

function useCurrent<ValueType>(value: ValueType): React.RefObject<ValueType> {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}

function useStoreDependency<Props, DepType>(
  dependency: Dependency<DepType>,
  props?: Props,
  dispatcher: Dispatcher<any> = getDispatcherInstance()
): DepType {
  enforceDispatcher(dispatcher);

  const [dependencyValue, setDependencyValue] = React.useState(
    calculate(dependency, props)
  );

  const currProps = useCurrent(props);

  React.useEffect(() => {
    const dependencyMap = { dependency };
    const dependencyIndex = makeDependencyIndex(dependencyMap);
    const dispatchToken: string = dispatcher.register(
      handleDispatch.bind(
        null,
        dispatcher,
        dependencyIndex,
        (entry: DependencyIndexEntry) => {
          const {
            dependency: newValue,
          }: { dependency?: DepType } = calculateForDispatch<
            Props,
            Partial<typeof dependencyMap>,
            DepType,
            typeof dependencyMap
          >(dependencyMap, entry, currProps.current);
          if (!shallowEqual(newValue, dependencyValue)) {
            setDependencyValue(newValue);
          }
        }
      )
    );
    return () => {
      dispatcher.unregister(dispatchToken);
    };
  }, [dispatcher, dependencyValue, dependency, currProps]);

  const newValue = calculate(dependency, props);
  if (!shallowEqual(newValue, dependencyValue)) {
    setDependencyValue(newValue);
  }
  return dependencyValue;
}

// const store = new StoreFactory({
//   getter() {
//     return 'test';
//   },
// }).register();
// const test = useStoreDependency(store);
// console.log(test);

export default useStoreDependency;
