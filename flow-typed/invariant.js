declare module 'invariant' {
  declare var exports: (
    condition: bool,
    message: string,
    ...params: Array<any>
  ) => void;
}
