/* @flow */

class Dispatcher {
  register: (handleDispatch: Function) => number;
  unregister: (handlerId: number) => void;
}

module.exports = Dispatcher;
