/* @flow */
import EventHandler from './EventHandler.js';
import uniqueID from '../uniqueid/uniqueID.js';

export default class Event {
  _handlers: { [key: string]: Function };

  constructor() {
    this._handlers = {};
  }

  /**
   * Add a subscription to this event
   *
   * @param  callback  run when the event is triggered.
   * @return this
   */
  addHandler(callback: Function): EventHandler {
    const key = uniqueID();
    this._handlers[key] = callback;
    return new EventHandler(this, key);
  }

  /**
   * Destroys this event. Removes all handlers.
   *
   * @return this
   */
  remove(): Event {
    this._handlers = {};
    return this;
  }

  /**
   * Removes a subscription by key.
   *
   * @param  key   id of the subscription to remove
   * @return this
   */
  removeHandler(key: string): Event {
    delete this._handlers[key];
    return this;
  }

  /**
   * @protected
   * Run a handler by key if it exists
   *
   * @param  key  id of the handler to run
   */
  _runHandler(key: string): void {
    if (this._handlers.hasOwnProperty(key)) {
      this._handlers[key].call();
    }
  }

  /**
   * Run all subscribed handlers.
   *
   * @return this
   */
  runHandlers(): Event {
    Object.keys(this._handlers).forEach(this._runHandler.bind(this));
    return this;
  }

  /**
   * Convenience method for running multiple events.
   *
   * @param  events  a list of events to run.
   */
  static runMultiple(events: Array<Event>): void {
    events.forEach(evt => evt.runHandlers());
  }
}
