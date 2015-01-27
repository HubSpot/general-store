/**
 * @flow
 */

var EventHandle = require('./EventHandle.js');

var keyCount = 0;
function nextKey(): number {
  return keyCount++;
}

class EventManager {

  _events: {[key:number]: Function};

  constructor() {
    this._events = {};
  }

  add(callback: Function): EventHandle {
    var key = nextKey();
    this._events[key] = callback;
    return new EventHandle(this, key);
  }

  remove(key: number): EventManager {
    delete this._events[key];
    return this;
  }

  run(): EventManager {
    Object.keys(this._events).forEach(key => {
      this._events[key].call();
    });
    return this;
  }

}

module.exports = EventManager;
