var fs = require('fs');
var recast = require('recast');
var through = require('through2');

var builders = recast.types.builders;

var DEV_EXPRESSION = builders.binaryExpression(
  '!==',
  builders.literal('production'),
  builders.memberExpression(
    builders.memberExpression(
      builders.identifier('process'),
      builders.identifier('env'),
      false
    ),
    builders.identifier('NODE_ENV'),
    false
  )
);

function transformToString(source, visitors) {
  return recast.print(
    recast.visit(
      recast.parse(source),
      visitors
    )
  ).code;
}

var visitors = {
  visitCallExpression: function(nodePath) {
    var node = nodePath.value;
    if (node.callee.name === 'invariant') {
      // Truncate the arguments of invariant(condition, ...)
      // statements to just the condition based on NODE_ENV
      // (dead code removal will remove the extra bytes).
      nodePath.replace(
        builders.conditionalExpression(
          DEV_EXPRESSION,
          node,
          builders.callExpression(
            node.callee,
            [node.arguments[0]]
          )
        )
      );
      return false;
    }
    this.traverse(nodePath);
  },
};

function truncateInvariant(file) {
  return through(function(buffer, enc, next) {
    this.push(
      transformToString(
        buffer.toString('utf8'),
        visitors
      )
    );
    next();
  });
}

module.exports = truncateInvariant;
