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

export function shallowEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) {
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
      } else if (obj1[property] !== obj2[property]) {
        return false;
      }
    }
  }
  return true;
}
