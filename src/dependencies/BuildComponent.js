// @flow

/* global ReactClass */
export function makeDisplayName(
  prefix: string,
  BaseComponent: { displayName?: string, name?: string }
) {
  const baseComponentName = BaseComponent.displayName || BaseComponent.name;
  return `${prefix}(${baseComponentName})`;
}

export function focuser(instance: Object, ...args: Array<*>) {
  if (
    !instance.wrappedInstance ||
    typeof instance.wrappedInstance.focus !== 'function'
  ) {
    return undefined;
  }
  return instance.wrappedInstance.focus(...args);
}

const reactStatics = {
  defaultProps: true,
  displayName: true,
  getDefaultProps: true,
  getInitialState: true,
  propTypes: true,
};

export function transferNonReactStatics(
  fromClass: Function,
  toClass: Function
) {
  Object.keys(fromClass).forEach(staticField => {
    if (!reactStatics[staticField]) {
      toClass[staticField] = fromClass[staticField];
    }
  });
}
