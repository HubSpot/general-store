declare module 'flux' {
  declare class Dispatcher {
    isDispatching(): bool;
    register(handleAction: (data: any, actionType: string) => void): string;
    unregister(dispatchToken: string): void;
    waitFor(dispatchTokens: Array<string>): void;
  }
}
