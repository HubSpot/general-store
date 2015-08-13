/**
 * @flow
 */

type EventManagerInterface = {
  removeHandler: (key: string) => any;
};

export default class EventHandler {

  _key: string;
  _instance: ?EventManagerInterface;

  constructor(
    instance: EventManagerInterface,
    key: string
  ) {
    this._key = key;
    this._instance = instance;
  }

  remove(): void {
    if (this._instance === null || this._instance === undefined) {
      return;
    }
    this._instance.removeHandler(this._key);
    this._instance = null;
  }

}
