import { Dispatcher } from 'flux';
import * as DispatcherInstance from '../dispatcher/DispatcherInstance';
import { enforceDispatcher } from '../dispatcher/DispatcherInterface';
import invariant from 'invariant';
import Store, { StoreGetter, StoreResponses, StoreResponse } from './Store';

const HINT_LINK =
  'Learn more about defining stores:' +
  ' https://github.com/HubSpot/general-store#create-a-store';

function enforceResponse(existingResponses, actionType, response) {
  invariant(
    typeof actionType === 'string',
    'StoreFactory.defineResponses: expected actionType to be a string' +
      ' but got "%s" instead. %s',
    actionType,
    HINT_LINK
  );
  invariant(
    !existingResponses.hasOwnProperty(actionType),
    'StoreFactory.defineResponses: conflicting resposes for actionType' +
      ' "%s". Only one response can be defined per actionType per Store. %s',
    actionType,
    HINT_LINK
  );
  invariant(
    typeof response === 'function',
    'StoreFactory.defineResponses: expected response to be a function' +
      ' but got "%s" instead. %s',
    response
  );
}

type StoreFactoryDefinition<T> = {
  getter?: StoreGetter<T>;
  getInitialState?: StoreGetter<T>;
  name?: string;
  responses?: StoreResponses<T>;
};

function defaultGetInitialState() {
  return undefined;
}

function defaultGetter<T>(state: T): T {
  return state;
}

export default class StoreFactory<T> {
  _definition: StoreFactoryDefinition<T>;

  constructor({
    getter,
    getInitialState,
    name,
    responses,
  }: StoreFactoryDefinition<T> = {}) {
    this._definition = {
      getter: getter || defaultGetter,
      getInitialState: getInitialState || defaultGetInitialState,
      name,
      responses: responses || {},
    };
  }

  defineGet(getter: StoreGetter<T>): StoreFactory<T> {
    invariant(
      this._definition.getter === defaultGetter,
      'StoreFactory.defineGet: a getter is already defined.'
    );
    return new StoreFactory({
      ...this._definition,
      getter,
    });
  }

  defineGetInitialState(getInitialState: StoreGetter<T>): StoreFactory<T> {
    invariant(
      typeof getInitialState === 'function',
      'StoreFactory.defineGetInitialState: getInitialState must be a function.'
    );
    return new StoreFactory({
      ...this._definition,
      getInitialState,
    });
  }

  defineName(name: string) {
    const currentName = this._definition.name;
    return new StoreFactory({
      ...this._definition,
      name: currentName ? `${name}(${currentName})` : name,
    });
  }

  defineResponses(newResponses: StoreResponses<T>): StoreFactory<T> {
    const { responses } = this._definition;
    invariant(
      newResponses && typeof newResponses === 'object',
      'StoreFactory.defineResponses: newResponses must be an object'
    );
    Object.keys(newResponses).forEach(actionType =>
      enforceResponse(responses, actionType, newResponses[actionType])
    );
    return new StoreFactory({
      ...this._definition,
      responses: {
        ...responses,
        ...newResponses,
      },
    });
  }

  defineResponseTo(
    actionTypes: string | Array<string>,
    response: StoreResponse<T>
  ): StoreFactory<T> {
    return this.defineResponses(
      [].concat(actionTypes).reduce((responses, actionType) => {
        responses[actionType] = response;
        return responses;
      }, {})
    );
  }

  getDefinition(): StoreFactoryDefinition<T> {
    return this._definition;
  }

  register(dispatcher?: Dispatcher<any>): Store<T> {
    dispatcher = dispatcher || DispatcherInstance.get();
    invariant(
      dispatcher !== null && typeof dispatcher === 'object',
      "StoreFactory.register: you haven't provided a dispatcher instance." +
        ' You can pass an instance to' +
        ' GeneralStore.define().register(dispatcher) or use' +
        ' GeneralStore.DispatcherInstance.set(dispatcher) to set a global' +
        ' instance.' +
        ' https://github.com/HubSpot/general-store#default-dispatcher-instance'
    );
    enforceDispatcher(dispatcher);
    const { getter, getInitialState, name, responses } = this._definition;
    return new Store({
      dispatcher,
      factory: this,
      getter,
      initialState: getInitialState(),
      name,
      responses,
    });
  }
}
