/**
 * @flow
 */

var nextUid = 0;
function uid(): number {
  return nextUid++;
}

module.exports = uid;
