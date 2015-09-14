/* @flow */

import invariant from '../invariant';

type Getter = (state: any) => any;

type Response = (state: any, payload: any, actionType: string) => any;

type Responses = {
  [key: string]: Response
};

type StoreFactoryDefinition = {
  getter: ?Getter;
  initialData: any;
  responses: Responses;
};

export default class StoreFactory {

  _definition: StoreDefinition;

  constructor({getter, initialData, responses = {}}) {
    this._definition = {
      getter,
      initialData,
      responses,
    };
  }

  defineGet(getter: (state: any) => any) {
    invariant(
      this._definition.getter === undefined,
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
    const {responses} = this._definition;
    Object.keys(newResponses).forEach(actionType => {
      invariant(
        !responses.hasOwnProperty(actionType),
        'StoreFacade: response to `%s` is already defined.',
        actionType
      );
    });
    return new StoreFactory({
      ...this._definition,
      responses: {
        ...responses,
        ...newResponses,
      },
    });
  }

  getDefinition(): StoreFactoryDefinition {
    return this._definition;
  }

  register(dispatcher: ?Dispatcher): Object {
    return {};
  }
}
