/**
 * @flow
 */

var PREFIX = 'uid_';

var nextUid = 0;
function uid(): string {
  return PREFIX + nextUid++;
}

module.exports = uid;
