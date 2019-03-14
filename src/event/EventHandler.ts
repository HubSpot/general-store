import Event from './Event';

export default class EventHandler {
  _key: string;
  _instance?: Event;

  constructor(instance: Event, key: string) {
    this._key = key;
    this._instance = instance;
  }

  getKey(): string {
    return this._key;
  }

  remove(): void {
    if (this._instance === null || this._instance === undefined) {
      return;
    }
    this._instance.removeHandler(this._key);
    this._instance = null;
  }
}
