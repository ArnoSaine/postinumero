// https://www.jpwilliams.dev/how-to-unpack-the-return-type-of-a-promise-in-typescript
type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;

export function useAsync<T>(fn, config?, args?): AsyncReturnType<T>;

export function recall(fn, config?, args?): void;

export function useAsyncSafe<T>(fn, config?, args?): [null, AsyncReturnType<T>];

export function create<T>(
  func: T,
  config?
): [
  useAsync: (...args: Parameters<T>) => AsyncReturnType<T>,
  recall: (...args: Parameters<T>) => void,
  useAsyncSafe: (...args: Parameters<T>) => [null, AsyncReturnType<T>]
];

export default useAsync;
