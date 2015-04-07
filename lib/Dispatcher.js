
declare class Dispatcher {
  isDispatching(): bool;
  register(handleAction: (data: any, actionType: string) => void): number;
  unregister(dispatchToken: number): void;
  waitFor(dispatchTokens: Array<number>): void;
}

