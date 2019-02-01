// @flow

/* global ReactClass */
export function makeDisplayName(
  prefix: string,
  BaseComponent: { displayName?: string, name?: string }
) {
  const baseComponentName = BaseComponent.displayName || BaseComponent.name || 'Component';
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
