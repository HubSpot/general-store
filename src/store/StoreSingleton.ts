import { Dispatcher } from 'flux';
import invariant from 'invariant';
import Store from './Store';
import StoreFactory from './StoreFactory';

const HINT_LINK =
  'Learn more about defining stores:' +
  ' https://github.com/HubSpot/general-store#create-a-store';

function dropFirstArg(func: Function) {
  return (head, ...tail) => func(...tail);
}

export default class StoreSingleton<T> {
  _facade?: Store<T>;
  _factory: StoreFactory<T>;
  _getter?: Function;

  constructor() {
    this._facade = null;
    this._factory = new StoreFactory({
      getter: (state, ...args) => {
        if (typeof this._getter !== 'function') {
          return undefined;
        }
        return this._getter(...args);
      },
    });
    this._getter = null;
  }

  defineGet(getter: () => any): StoreSingleton<T> {
    invariant(
      !this.isRegistered(),
      'StoreSingleton.defineGet: this store definition cannot be modified' +
        ' because it has already been registered with a dispatcher. %s',
      HINT_LINK
    );
    invariant(
      typeof getter === 'function',
      'StoreSingleton.defineGet: expected getter to be a function but got' +
        ' "%s" instead. %s',
      getter,
      HINT_LINK
    );
    this._getter = getter;
    return this;
  }

  defineName(name: string): StoreSingleton<T> {
    this._factory.defineName(name);
    return this;
  }

  defineResponseTo(
    actionTypes: Array<string> | string,
    response: (data: any) => void
  ): StoreSingleton<T> {
    invariant(
      !this.isRegistered(),
      'StoreSingleton.defineResponseTo: this store definition cannot be' +
        ' modified because is has already been registered with a dispatcher. %s',
      HINT_LINK
    );
    this._factory = this._factory.defineResponseTo(
      actionTypes,
      dropFirstArg(response)
    );
    return this;
  }

  isRegistered(): boolean {
    return this._facade instanceof Store;
  }

  register(dispatcher?: Dispatcher<any>): Store<T> {
    invariant(
      typeof this._getter === 'function',
      'StoreSingleton.register: a store cannot be registered without a' +
        ' getter. Use GeneralStore.define().defineGet(getter) to define a' +
        ' getter. %s',
      HINT_LINK
    );
    if (!this._facade) {
      this._facade = this._factory.register(dispatcher);
    }
    return this._facade;
  }
}
