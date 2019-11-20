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

type SingleDependency = {
  [key: string]: Dependency;
};

function useCurrent<ValueType>(value: ValueType): React.RefObject<ValueType> {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}

function useStoreDependency<Props>(
  dependency: Dependency,
  props: Props,
  dispatcher: Dispatcher<any> = getDispatcherInstance()
) {
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
          }: SingleDependency = calculateForDispatch(
            dependencyMap,
            entry,
            currProps.current
          );
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

export default useStoreDependency;
