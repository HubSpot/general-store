/* @flow */

interface Dispatcher {
  register(handleAction: (data: any, actionType: string) => void): number;
  unregister(dispatchToken: number): void;
}

function composeError(args: Array<any>): Error {
  return new Error(args.join(' '));
}

var TypeHints = {

  enforceDispatcherInterface(
    dispatcher: any,
    scope: string
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      if (dispatcher === null || dispatcher === undefined) {
        throw composeError([
          scope,
          ': DispatcherInstance is not defined'
        ]);
      }
      if (
        typeof dispatcher !== 'object' ||
        typeof dispatcher.register !== 'function'
      ) {
        throw composeError([
          scope,
          ': expected an object with a register method but got "',
          dispatcher,
          '" instead.'
        ]);
      }
    }
  },

  enforceIsFunction(arg: any, scope: string): void {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof arg !== 'function') {
        throw composeError([
          scope,
          ': expected a function but got "',
          arg,
          '" instead.'
        ]);
      }
    }
  },

  enforceIsString(
    arg: any,
    scope: string
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      if (typeof arg !== 'string') {
        throw composeError([
          scope,
          ': expected a string but got "',
          arg,
          '" instead.'
        ]);
      }
    }
  },

  enforceKeyIsDefined(
    context: Object,
    key: string,
    scope: string
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      if (!context.hasOwnProperty(key)) {
        throw composeError([
          scope,
          ': "',
          key,
          '" is not defined.'
        ]);
      }
    }
  },

  enforceKeyIsNotDefined(
    context: Object,
    key: string,
    scope: string
  ): void {
    if (process.env.NODE_ENV !== 'production') {
      if (context.hasOwnProperty(key)) {
        throw composeError([
          scope,
          ': "',
          key,
          '" is already defined.'
        ]);
      }
    }
  }

};

module.exports = TypeHints;
