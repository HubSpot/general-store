/* @flow */
import type { Dispatcher } from 'flux';
import DispatcherInstance from '../dispatcher/DispatcherInstance';
import { isDispatcher } from '../dispatcher/DispatcherInterface.js';
import invariant from '../invariant';
import Store from './Store';

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

type Getter = (state: any) => any;

type Response = (state: any, payload: any, actionType: string) => any;

type Responses = {
  [key: string]: Response
};

type StoreFactoryDefinition = {
  getter: Getter;
  getInitialState: () => any;
  responses: Responses;
};

function defaultGetInitialState() {
  return undefined;
}

function defaultGetter(state: any): any {
  return state;
}

export default class StoreFactory {

  _definition: StoreFactoryDefinition;

  constructor({getter, getInitialState, responses}:Object) {
    this._definition = {
      getter: getter || defaultGetter,
      getInitialState: getInitialState || defaultGetInitialState,
      responses: responses || {},
    };
  }

  defineGet(getter: Getter): StoreFactory {
    invariant(
      this._definition.getter === defaultGetter,
      'StoreFactory.defineGet: a getter is already defined.'
    );
    return new StoreFactory({
      ...this._definition,
      getter,
    });
  }

  defineGetInitialState(getInitialState: () => any): StoreFactory {
    invariant(
      typeof getInitialState === 'function',
      'StoreFactory.defineGetInitialState: getInitialState must be a function.'
    );
    invariant(
      this._definition.getInitialState === defaultGetInitialState,
      'StoreFactory.defineGetInitialState: getInitialState is already defined.'
    );
    return new StoreFactory({
      ...this._definition,
      getInitialState,
    });
  }

  defineResponses(newResponses: Responses): StoreFactory {
    const {responses} = this._definition;
    invariant(
      newResponses && typeof newResponses === 'object',
      'StoreFactory.defineResponses: newResponses must be an object'
    );
    Object.keys(newResponses).forEach(
      actionType => enforceResponse(
        responses,
        actionType,
        newResponses[actionType]
      )
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
    response: Response
  ): StoreFactory {
    return this.defineResponses(
      [].concat(actionTypes).reduce((responses, actionType) => {
        responses[actionType] = response;
        return responses;
      }, {})
    );
  }

  getDefinition(): StoreFactoryDefinition {
    return this._definition;
  }

  register(dispatcher: ?Dispatcher): Store {
    dispatcher = dispatcher || DispatcherInstance.get();
    invariant(
      dispatcher !== null && typeof dispatcher === 'object',
      'StoreFactory.register: you haven\'t provided a dispatcher instance.' +
      ' You can pass an instance to' +
      ' GeneralStore.define().register(dispatcher) or use' +
      ' GeneralStore.DispatcherInstance.set(dispatcher) to set a global' +
      ' instance.' +
      ' https://github.com/HubSpot/general-store#default-dispatcher-instance'
    );
    invariant(
      isDispatcher(dispatcher),
      'StoreFactory.register: Expected dispatcher to be an object' +
      ' with a register method, and an unregister method but got "%s".' +
      ' Learn more about the dispatcher interface:' +
      ' https://github.com/HubSpot/general-store#dispatcher-interface',
      dispatcher
    );
    const {getter, getInitialState, responses} = this._definition;
    return new Store({
      dispatcher,
      factory: this,
      getter,
      initialState: getInitialState(),
      responses,
    });
  }
}
