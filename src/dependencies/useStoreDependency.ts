import {
  Dispatch,
  RefObject,
  SetStateAction,
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {
  Dependency,
  calculate,
  calculateForDispatch,
  makeDependencyIndex,
  DependencyIndexEntry,
  DependencyMap,
  GetDependencyType,
} from './DependencyMap';
import { get as getDispatcherInstance } from '../dispatcher/DispatcherInstance';
import { enforceDispatcher } from '../dispatcher/DispatcherInterface';
import { handleDispatch } from './Dispatch';
import { Dispatcher } from 'flux';
import { shallowEqual } from '../utils/ObjectUtils';

export function useCurrent<ValueType>(value: ValueType): RefObject<ValueType> {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export function _useDispatchSubscription<
  Props,
  DependencyMapType extends DependencyMap,
  DependenciesType = {
    [key in keyof DependencyMapType]: GetDependencyType<DependencyMapType[key]>
  }
>(
  dependencyMap: DependencyMapType,
  currentProps: RefObject<Props>,
  dispatcher: Dispatcher<any>,
  dependencyValue: DependenciesType,
  setDependencyValue: Dispatch<SetStateAction<DependenciesType>>
) {
  useEffect(() => {
    const dependencyIndex = makeDependencyIndex(dependencyMap);
    const dispatchToken: string = dispatcher.register(
      handleDispatch.bind(
        null,
        dispatcher,
        dependencyIndex,
        (entry: DependencyIndexEntry) => {
          const newValue = calculateForDispatch<
            Props,
            Partial<typeof dependencyMap>,
            DependencyMapType
          >(dependencyMap, entry, currentProps.current, dependencyValue);
          if (
            Object.keys(newValue)
              .map(k => shallowEqual(newValue[k], dependencyValue[k]))
              .some(el => !el)
          ) {
            setDependencyValue((newValue as unknown) as DependenciesType);
          }
        }
      )
    );
    return () => {
      dispatcher.unregister(dispatchToken);
    };
  }, [
    currentProps,
    dependencyMap,
    dependencyValue,
    dispatcher,
    setDependencyValue,
  ]);
}

function useStoreDependency<Props, DepType>(
  dependency: Dependency<DepType>,
  props?: Props,
  dispatcher: Dispatcher<any> = getDispatcherInstance()
): DepType {
  enforceDispatcher(dispatcher);

  const newValue = { dependency: calculate(dependency, props) };
  const [dependencyValue, setDependencyValue] = useState(newValue);

  const currProps = useCurrent(props);

  const dependencyMap = useMemo(() => ({ dependency }), [dependency]);

  _useDispatchSubscription(
    dependencyMap,
    currProps,
    dispatcher,
    dependencyValue,
    setDependencyValue
  );

  if (!shallowEqual(newValue.dependency, dependencyValue.dependency)) {
    setDependencyValue(newValue);
    return newValue.dependency;
  }
  return dependencyValue.dependency;
}

export default useStoreDependency;
