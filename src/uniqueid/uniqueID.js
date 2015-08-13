/**
 * @flow
 */

var PREFIX = 'uid_';

var nextUid = 0;
export default function uid(): string {
  return PREFIX + nextUid++;
}
