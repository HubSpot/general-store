export function oForEach(
  subject: { [key: string]: any },
  operation: (value: any, key: string) => void
): void {
  for (const key in subject) {
    if (subject.hasOwnProperty(key)) {
      operation(subject[key], key);
    }
  }
}

export function oMap<ToMap extends { [key: string]: any }, Mapped>(
  subject: { [key in keyof ToMap]: ToMap[key] },
  mapper: (value: any, key: string | number | symbol) => Mapped
): { [key in keyof ToMap]: Mapped } {
  const result: Partial<{ [key in keyof ToMap]: Mapped }> = {};
  oForEach(subject, (value, key: keyof ToMap) => {
    result[key] = mapper(value, key);
  });
  return result as { [key in keyof ToMap]: Mapped };
}

export function oMerge<T>(
  subject: { [key: string]: T },
  updates: { [key: string]: T }
): { [key: string]: T } {
  oForEach(updates, (value, key) => {
    subject[key] = value;
  });
  return subject;
}

export function oReduce<T, R>(
  subject: { [key: string]: T },
  reducer: (acc: R, value: T, key: string) => R,
  initialAcc: R
): R {
  let result = initialAcc;
  oForEach(subject, (value, key) => {
    result = reducer(result, value, key);
  });
  return result;
}

function isImmutable(obj: any): boolean {
  return (
    obj &&
    typeof obj.hashCode === 'function' &&
    typeof obj.equals === 'function'
  );
}

function _compareArrays(arr1?: unknown[], arr2?: unknown[]): boolean {
  if (!arr1 || !arr2) return false;
  if (arr1.length !== arr2.length) {
    return false;
  }
  if (!arr1.length) {
    return true;
  }
  for (const idx in arr1) {
    // this makes it _technically_ not a shallow equal for array values,
    // but for stores that return arrays of objects, the object identities
    // will likely not be equal so we should actually inspect the objects
    // to see if they're equal
    if (!shallowEqual(arr1[idx], arr2[idx])) {
      return false;
    }
  }
  return true;
}

// polyfill for Object.is
function objectIs(x: any, y: any) {
  return (
    (x === y && (x !== 0 || 1 / x === 1 / y)) || (x !== x && y !== y) // eslint-disable-line no-self-compare
  );
}

export function shallowEqual(obj1: any, obj2: any): boolean {
  if (objectIs(obj1, obj2)) {
    return true;
  }

  // Special handling for FB Immutables, as they must be handled specially.
  // While this technically means this is deep equality for Immutables,
  // it's better to have a more specific check than an entirely incorrect one.
  if (isImmutable(obj1) && isImmutable(obj2)) {
    return obj1.equals(obj2);
  }

  if (typeof obj1 !== typeof obj2) {
    return false;
  }
  // would have passed === check if both were same falsy value
  if (!obj1 || !obj2) {
    return false;
  }
  if (typeof obj1 !== 'object') {
    return false;
  }
  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
  }
  for (const property in obj1) {
    if (obj1.hasOwnProperty(property) && !obj2.hasOwnProperty(property)) {
      return false;
    }
    if (!obj1.hasOwnProperty(property) && obj2.hasOwnProperty(property)) {
      return false;
    }
    if (obj1.hasOwnProperty(property) && obj2.hasOwnProperty(property)) {
      if (isImmutable(obj1[property]) && isImmutable(obj2[property])) {
        if (!obj1[property].equals(obj2[property])) {
          return false;
        }
      } else if (
        Array.isArray(obj1[property]) ||
        Array.isArray(obj2[property])
      ) {
        return _compareArrays(obj1[property], obj2[property]);
      } else if (!objectIs(obj1[property], obj2[property])) {
        return false;
      }
    }
  }
  return true;
}
