export function oForEach<T>(
  subject: { [key: string]: T },
  operation: (value: T, key: string) => void
): void {
  for (const key in subject) {
    if (subject.hasOwnProperty(key)) {
      operation(subject[key], key);
    }
  }
}

export function oMap<T, R>(
  subject: { [key: string]: T },
  mapper: (value: any, key: string) => R
): { [key: string]: R } {
  const result = {};
  oForEach(subject, (value, key) => {
    result[key] = mapper(value, key);
  });
  return result;
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

export function oFilterMap<T, R>(
  subject: { [key: string]: T },
  filter: (value: T, key: string) => boolean,
  mapper: (value: T, key: string) => R
): { [key: string]: R } {
  return oReduce(
    subject,
    (result, value, key) => {
      if (filter(value, key)) {
        result[key] = mapper(value, key);
      }
      return result;
    },
    {}
  );
}

export function shallowEqual(obj1: any, obj2: any): Boolean {
  if (obj1 === obj2) {
    return true;
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
      if (obj1[property] !== obj2[property]) {
        return false;
      }
    }
  }
  return true;
}
