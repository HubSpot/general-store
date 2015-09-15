/* @flow */

import DispatcherInstance from '../dispatcher/DispatcherInstance';
import {isDispatcher} from '../dispatcher/DispatcherInterface.js';
import invariant from '../invariant';
import StoreFacade from './StoreFacade';

var HINT_LINK =
  'Learn more about defining stores:' +
  ' https://github.com/HubSpot/general-store#create-a-store';

function emptyGetter() {
  return null;
}

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
  initialData: any;
  responses: Responses;
};

export default class StoreFactory {

  _definition: StoreFactoryDefinition;

  constructor({getter, initialData, responses}:Object) {
    this._definition = {
      getter: getter,
      initialData: initialData,
      responses: responses || {},
    };
  }

  defineGet(getter: Getter): StoreFactory {
    invariant(
      typeof this._definition.getter !== 'function',
      'StoreFactory.defineGet: a getter is already defined.'
    );
    return new StoreFactory({
      ...this._definition,
      getter,
    });
  }

  defineInitialData(initialData: any): StoreFactory {
    invariant(
      this._definition.initialData === undefined,
      'StoreFactory.defineInitialData: initialData is already defined.'
    );
    return new StoreFactory({
      ...this._definition,
      initialData,
    });
  }

  defineResponses(newResponses: Responses): StoreFactory {
    invariant(
      newResponses && typeof newResponses === 'object',
      'StoreFactory.defineResponses: newResponses must be an object'
    );
    var {responses} = this._definition;
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

  register(dispatcher: ?Dispatcher): StoreFacade {
    dispatcher = dispatcher || DispatcherInstance.get();
    invariant(
      dispatcher !== null && typeof dispatcher === 'object',
      'StoreFactory.register: you haven\'t provide a dispatcher instance.' +
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
    return new StoreFacade({
      ...this._definition,
      dispatcher,
    });
  }
}
