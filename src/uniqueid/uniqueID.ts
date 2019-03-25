const PREFIX = 'uid_';

let nextUid = 0;
export default function uid(): string {
  return PREFIX + nextUid++;
}
