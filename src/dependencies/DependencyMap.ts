import { ComponentType } from 'react';
import { getActionTypes, getDispatchToken } from '../store/InspectStore';
import invariant from 'invariant';
import { oForEach, oMap, oMerge, oReduce } from '../utils/ObjectUtils';
import Store from '../store/Store';
import hoistStatics from 'hoist-non-react-statics';

export type CompoundDependency<T> = {
  propTypes?: Object;
  stores: Store<any>[];
  deref: (props?: Object, state?: Object, stores?: Store<any>[]) => T;
};

export type Dependency<T> = CompoundDependency<T> | Store<T>;

export type DependencyIndexEntry = {
  dispatchTokens: { [key: string]: boolean };
  fields: { [key: string]: boolean };
};

export type DependencyIndex = {
  [key: string]: DependencyIndexEntry;
};

export type DependencyMap = {
  readonly [key: string]: Dependency<any>;
};

export type GetProps<C> = C extends ComponentType<infer P>
  ? P extends {}
    ? P
    : never
  : never;
export type GetDependencyType<D> = D extends Dependency<infer T> ? T : never;
export type DependencyMapProps<
  DM extends DependencyMap
> = DM extends DependencyMap
  ? { [key in keyof DM]: GetDependencyType<DM[key]> }
  : never;
export type ConnectedComponentType<P, C> = React.ForwardRefExoticComponent<
  P & C
> & {
  WrappedComponent: C;
  dependencies: DependencyMap;
} & hoistStatics.NonReactStatics<P & C>;

export type PropTypes = {
  [key: string]: Function;
};

export function enforceValidDependencies(
  dependencies: DependencyMap
): DependencyMap {
  invariant(
    dependencies && typeof dependencies === 'object',
    'expected `dependencies` to be an `object` but got `%s`',
    dependencies
  );
  oForEach(dependencies, (dependency, field) => {
    if (dependency instanceof Store) {
      return;
    }
    invariant(
      dependency && typeof dependency === 'object',
      'expected `%s` to be an `object` but got `%s`',
      field,
      dependency
    );
    const { deref, stores } = dependency;
    invariant(
      typeof deref === 'function',
      'expected `%s.deref` to be a function but got `%s`',
      field,
      deref
    );
    invariant(
      Array.isArray(stores),
      'expected `%s.stores` to be an Array but got `%s`',
      field,
      dependency.stores
    );
    stores.forEach((store, index) => {
      invariant(
        store instanceof Store,
        'expected `%s.stores.%s` to be a `Store` but got `%s`',
        field,
        index,
        store
      );
    });
  });
  return dependencies;
}

export function dependencyPropTypes(
  dependencies: DependencyMap,
  existingPropTypes: { [key: string]: Function } = {}
): PropTypes {
  const unrelatedPropTypes = oReduce(
    existingPropTypes,
    (keep, type, name) => {
      if (!dependencies.hasOwnProperty(name)) {
        keep[name] = type;
      }
      return keep;
    },
    {}
  );
  return oReduce(
    dependencies,
    (types, dependency: any) => {
      if (dependency instanceof Store) {
        return types;
      }
      // eslint-disable-next-line react-app/react/forbid-foreign-prop-types
      const { propTypes } = dependency;
      if (!propTypes || typeof propTypes !== 'object') {
        return types;
      }
      return oMerge(types, propTypes);
    },
    unrelatedPropTypes
  );
}

export function calculate<Props, State, DerefValue>(
  dependency: Dependency<DerefValue>,
  props?: Props,
  state?: State
): DerefValue {
  if (dependency instanceof Store) {
    return dependency.get();
  }
  const { deref, stores } = dependency;
  return deref(props, state, stores);
}

export function calculateInitial<Props, State, Deps extends DependencyMap>(
  dependencies: Deps,
  props: Props,
  state?: State
): { [key in keyof Deps]: GetDependencyType<Deps[key]> } {
  return oMap(dependencies, dependency =>
    calculate(dependency, props, state)
  ) as { [key in keyof Deps]: GetDependencyType<Deps[key]> };
}

export function calculateForDispatch<Props, State, Deps extends DependencyMap>(
  dependencies: Deps,
  dependencyIndexEntry: DependencyIndexEntry,
  props: Props,
  state?: State
): { [key in keyof Deps]: Deps[key] } {
  return oMap(dependencyIndexEntry.fields, (_, field) =>
    calculate(dependencies[field as string], props, state)
  ) as { [key in keyof Deps]: GetDependencyType<Deps[key]> };
}

function makeIndexEntry(): DependencyIndexEntry {
  return {
    fields: {},
    dispatchTokens: {},
  };
}

export function makeDependencyIndex(
  dependencies: DependencyMap
): DependencyIndex {
  enforceValidDependencies(dependencies);
  return oReduce(
    dependencies,
    (index, dep, field) => {
      const stores = dep instanceof Store ? [dep] : dep.stores;
      stores.forEach(store => {
        getActionTypes(store).forEach(actionType => {
          let entry = index[actionType];
          if (!entry) {
            entry = index[actionType] = makeIndexEntry();
          }
          const token = getDispatchToken(store);
          entry.dispatchTokens[token] = true;
          entry.fields[field] = true;
        });
      });
      return index;
    },
    {}
  );
}
