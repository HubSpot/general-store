declare module 'flux' {
  declare type FSAction = {
    actionType?: string;
    data?: any;
    type: string;
    payload: any;
  };

  declare type GSAction = {
    actionType: string;
    data: any;
    payload?: any;
    type?: string;
  };

  declare type Action = GSAction | FSAction;

  declare class Dispatcher {
    dispatch: Action;
    isDispatching(): bool;
    register(handleAction: (data: any, actionType: string) => void): string;
    unregister(dispatchToken: string): void;
    waitFor(dispatchTokens: Array<string>): void;
  }
}
