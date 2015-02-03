// Type definitions for Jest 0.1.18
// Project: http://facebook.github.io/jest/
// Definitions by: Asana <https://asana.com>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare function EmptyFunction(): void;

declare function It(name: string, fn: EmptyFunction): void;

declare class MockContext<T> {
  calls: any[][];
  instances: T[];
}

declare class Mock<T> {
  new(): T;
  (...args:any[]): any;
  mock: MockContext<T>;
  mockClear(): void;
  mockImplementation(fn: Function): Mock<T>;
  mockImpl(fn: Function): Mock<T>;
  mockReturnThis(): Mock<T>;
  mockReturnValue(value: any): Mock<T>;
  mockReturnValueOnce(value: any): Mock<T>;
}

declare class Matchers {
  not: Matchers;
  toThrow(expected?: any): boolean;
  toBe(expected: any): boolean;
  toEqual(expected: any): boolean;
  toBeFalsy(): boolean;
  toBeTruthy(): boolean;
  toBeNull(): boolean;
  toBeUndefined(): boolean;
  toMatch(expected: RegExp): boolean;
  toContain(expected: string): boolean;
  toBeCloseTo(expected: number, delta: number): boolean;
  toBeGreaterThan(expected: number): boolean;
  toBeLessThen(expected: number): boolean;
  toBeCalled(): boolean;
  toBeCalledWith(...args: any[]): boolean;
  lastCalledWith(...args: any[]): boolean;
}

declare class JestStatic {
  autoMockOff(): void;
  autoMockOn(): void;
  clearAllTimers(): void;
  dontMock(moduleName: string): void;
  genMockFromModule<T>(moduleName: string): Mock<T>;
  genMockFunction<T>(): Mock<T>;
  genMockFn<T>(): Mock<T>;
  mock(moduleName: string): void;
  runAllTicks(): void;
  runAllTimers(): void;
  runOnlyPendingTimers(): void;
  setMock<T>(moduleName: string, moduleExports: T): void;

}

declare var jest: JestStatic;

declare function afterEach(fn: EmptyFunction): void;
declare function beforeEach(fn: EmptyFunction): void;
declare function describe(name: string, fn: EmptyFunction): void;
declare var it: It;
declare function pit(name: string, fn: EmptyFunction): void;
declare function require(moduleName: string): any;
declare function xdescribe(name: string, fn: EmptyFunction): void;
declare function xit(name: string, fn: EmptyFunction): void;

declare function expect(actual: any): Matchers;

