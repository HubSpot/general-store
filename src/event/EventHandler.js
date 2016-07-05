/* @flow */
import type Event from './Event';

export default class EventHandler {

  _key: string;
  _instance: ?Event;

  constructor(
    instance: Event,
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
