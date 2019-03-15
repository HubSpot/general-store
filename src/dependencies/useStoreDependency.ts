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

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
function usePrevious<ValueType>(value: ValueType): ValueType {
  const ref = React.useRef(value);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

function useStoreDependency<Props>(
  dependency: Dependency,
  props: Props,
  dispatcher: Dispatcher<any> = getDispatcherInstance()
) {
  enforceDispatcher(dispatcher);

  const dispatchToken = React.useRef(null);
  const dependencyMap = React.useRef<SingleDependency>({
    dependency,
  });
  const [dependencyIndex] = React.useState(() =>
    makeDependencyIndex(dependencyMap.current)
  );
  const [dependencyValue, setDependencyValue] = React.useState(
    calculate(dependency, props)
  );

  const prevProps = usePrevious(props);
  React.useEffect(() => {
    if (!shallowEqual(prevProps, props) || !dispatchToken.current) {
      dispatchToken.current = dispatcher.register(
        handleDispatch.bind(
          null,
          dispatcher,
          dependencyIndex,
          (entry: DependencyIndexEntry) => {
            const {
              dependency: newValue,
            }: SingleDependency = calculateForDispatch(
              dependencyMap.current,
              entry,
              props
            );
            if (newValue !== dependencyValue) {
              setDependencyValue(newValue);
            }
          }
        )
      );
    }
    return () => {
      dispatcher.unregister(dispatchToken.current);
      dispatchToken.current = null;
    };
  }, [dispatcher, dependencyIndex, props, prevProps, dependencyValue]);
  const newValue = calculate(dependency, props);
  if (newValue !== dependencyValue) {
    setDependencyValue(newValue);
  }
  return dependencyValue;
}

export default useStoreDependency;
