/**
 * @flow
 */

type EventManagerInterface = {
  remove: (key: number) => any;
};

class EventHandle {

  _key: number;
  _instance: EventManagerInterface;
  _isRemoved: bool;

  constructor(
    instance: Object,
    key: number
  ) {
    this._key = key;
    this._instance = instance;
    this._isRemoved = false;
  }

  remove(): void {
    if (this._isRemoved) {
      return;
    }
    this._instance.remove(this._key);
  }

}

module.exports = EventHandle;
