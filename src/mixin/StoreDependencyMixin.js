/**
 * @flow
 */
import type { DependencyMap } from '../dependencies/DependencyMap';
import {
  calculate,
  calculateInitial,
  calculateForPropsChange,
  calculateForStateChange,
  dependencyPropTypes,
  dependenciesUseState,
  makeDependencyIndex,
} from '../dependencies/DependencyMap';
import * as DispatcherInstance from '../dispatcher/DispatcherInstance';

type ReactMixin = {
  __dispatchToken?: string;
  propTypes?: Object;
  componentWillMount: Function;
  componentWillReceiveProps: Function;
  componentDidUpdate?: Function;
  componentWillUnmount: Function;
}

function waitForStores(dispatcher, tokens) {
  if (dispatcher) {
    dispatcher.waitFor(tokens);
  }
}

export default function StoreDependencyMixin(
  dependencies: DependencyMap,
  overrideDispatcher: ?Object
): ReactMixin {
  const dependencyIndex = makeDependencyIndex(dependencies);
  const dispatcher = overrideDispatcher || DispatcherInstance.get();

  const mixin: ReactMixin = {
    getInitialState(): Object {
      return {};
    },

    componentWillMount(): void {
      if (dispatcher) {
        this.__dispatchToken = dispatcher.register((payload) => {
          const actionType = payload.actionType || payload.type;
          if (!dependencyIndex[actionType]) {
            return;
          }
          const entry = dependencyIndex[actionType];
          waitForStores(dispatcher, entry.dispatchTokens);
          this.setState(
            entry.fields.reduce((updates, field) => {
              updates[field] = calculate(
                dependencies[field],
                this.props,
                this.state
              );
              return updates;
            }, {})
          );
        });
      }
      this.setState(
        calculateInitial(dependencies, this.props, this.state)
      );
    },

    componentWillReceiveProps(nextProps): void {
      this.setState(
        calculateForPropsChange(dependencies, nextProps)
      );
    },

    componentWillUnmount(): void {
      if (dispatcher && this.__dispatchToken) {
        dispatcher.unregister(this.__dispatchToken);
      }
    },
  };

  if (dependenciesUseState(dependencies)) {
    mixin.componentDidUpdate = () => {
      this.setState(
        calculateForStateChange(dependencies, this.props, this.state)
      );
    };
  }

  if (process.env.NODE_ENV !== 'production') {
    mixin.propTypes = dependencyPropTypes(dependencies);
  }

  return mixin;
}
