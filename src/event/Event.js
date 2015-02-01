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

  addHandler(callback: Function): EventHandler {
    var key = uniqueID();
    this._handlers[key] = callback;
    return new EventHandler(this, key);
  }

  removeHandler(key: number): Event {
    delete this._handlers[key];
    return this;
  }

  _runHandler(key: number): Event {
    if (this._handlers.hasOwnProperty(key)) {
      this._handlers[key].call();
    }
    return this;
  }

  runHandlers(): Event {
    Object.keys(this._handlers).forEach(this._runHandler.bind(this));
    return this;
  }

}

Event.runMultiple = function (events: Array<Event>): void {
  events.forEach(evt => evt.runHandlers());
};

module.exports = Event;
