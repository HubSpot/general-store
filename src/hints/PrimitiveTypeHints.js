/* @flow */

function composeError(args: Array<any>): Error {
  return Error(
    args.join(' ')
  );
}

var PrimitiveTypeHints = {

  enforceIsFunction(arg: any, scope: string): void {
    if (typeof arg !== 'function') {
      throw composeError([
        scope,
        ': expected a function but got "',
        arg,
        '" instead.'
      ]);
    }
  },

  enforceIsString(
    arg: any,
    scope: string
  ): void {
    if (typeof arg !== 'string') {
      throw composeError([
        scope,
        ': expected a string but got "',
        arg,
        '" instead.'
      ]);
    }
  },

  enforceUniqueKey(
    context: Object,
    key: string,
    scope: string
  ): void {
    if (context.hasOwnProperty(key)) {
      throw composeError([
        scope,
        ': "',
        key,
        '" is already defined'
      ]);
    }
  },

  enforceKeyIsDefined(
    context: Object,
    key: string,
    scope: string
  ): void {
    if (!context.hasOwnProperty(key)) {
      throw composeError([
        scope,
        ': "',
        key,
        '" is not defined'
      ]);
    }
  }

};

module.exports = PrimitiveTypeHints;
