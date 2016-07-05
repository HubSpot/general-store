/* @flow */
import invariant from 'invariant';
import {
  oFilterMap,
  oForEach,
  oMap,
  oMerge,
  oReduce,
} from '../utils/ObjectUtils';
import Store from '../store/Store';

export type CompoundDependency = {
  propTypes?: Object,
  stores: Array<Store>;
  deref: (
    props: Object,
    state: ?Object,
    stores: Array<Store>
  ) => any;
};

export type Dependency = CompoundDependency | Store;

export type DependencyIndexEntry = {
  dispatchTokens: {[key:string]: bool};
  fields: {[key:string]: bool};
};

export type DependencyIndex = {
  [key:string]: DependencyIndexEntry;
};

export type DependencyMap = {
  [key:string]: Dependency;
};

export type PropTypes = {
  [key:string]: Function;
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

export function dependencyPropTypes(dependencies: DependencyMap): PropTypes {
  return oReduce(dependencies, (types, dependency) => {
    const { propTypes } = dependency;
    if (!propTypes || typeof propTypes !== 'object') {
      return types;
    }
    return oMerge(types, propTypes);
  }, {});
}

export function calculate(
  dependency: Dependency,
  props: Object,
  state: ?Object
): any {
  if (dependency instanceof Store) {
    return dependency.get();
  }
  const { deref, stores } = dependency;
  if (deref.length === 0) {
    return deref();
  }
  if (deref.length === 1) {
    return deref(props);
  }
  return deref(props, state, stores);
}

export function calculateInitial(
  dependencies: DependencyMap,
  props: Object,
  state: ?Object
): Object {
  return oMap(
    dependencies,
    (dependency) => calculate(dependency, props, state)
  );
}

export function calculateForDispatch(
  dependencies: DependencyMap,
  dependencyIndexEntry: DependencyIndexEntry,
  props: Object,
  state: ?Object
): Object {
  return oMap(
    dependencyIndexEntry.fields,
    (_, field) => calculate(dependencies[field], props, state),
  );
}

export function calculateForPropsChange(
  dependencies: DependencyMap,
  props: Object
): Object {
  return oFilterMap(
    dependencies,
    (dep) => dep.deref && dep.deref.length > 0,
    (dep) => calculate(dep, props)
  );
}

export function calculateForStateChange(
  dependencies: DependencyMap,
  props: Object,
  state: ?Object
): Object {
  return oFilterMap(
    dependencies,
    (dep) => dep.deref && dep.deref.length > 1,
    (dep) => calculate(dep, props, state)
  );
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
  return oReduce(dependencies, (index, dep, field) => {
    const stores = dep instanceof Store ? [dep] : dep.stores;
    stores.forEach((store) => {
      store.getActionTypes().forEach((actionType) => {
        let entry = index[actionType];
        if (!entry) {
          entry = index[actionType] = makeIndexEntry();
        }
        const token = store.getDispatchToken();
        entry.dispatchTokens[token] = true;
        entry.fields[field] = true;
      });
    });
    return index;
  }, {});
}

export function dependenciesUseState(dependencies: DependencyMap): bool {
  for (const field in dependencies) {
    if (!dependencies.hasOwnProperty(field)) {
      continue;
    }
    const dep = dependencies[field];
    if (!(dep instanceof Store) && dep.deref.length > 1) {
      return true;
    }
  }
  return false;
}
