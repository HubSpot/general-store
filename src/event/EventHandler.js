/**
 * @flow
 */

type EventManagerInterface = {
  removeHandler: (key: number) => any;
};

class EventHandler {

  _key: number;
  _instance: ?EventManagerInterface;

  constructor(
    instance: Object,
    key: number
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

module.exports = EventHandler;
