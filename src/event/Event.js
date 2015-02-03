/**
 * @flow
 */

var EventHandler = require('./EventHandler.js');

var uniqueID = require('../uniqueid/uniqueID.js');

class Event {

  _handlers: {[key:number]: Function};

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
    var key = uniqueID();
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
  removeHandler(key: number): Event {
    delete this._handlers[key];
    return this;
  }

  /**
   * @protected
   * Run a handler by key if it exists
   *
   * @param  key  id of the handler to run
   */
  _runHandler(key: number): void {
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

}

/**
 * Convenience method for running multiple events.
 *
 * @param  events  a list of events to run.
 */
Event.runMultiple = function (events: Array<Event>): void {
  events.forEach(evt => evt.runHandlers());
};

module.exports = Event;
