export type Config = { id?: string };

export type Fn = (...args: any[]) => any;

export type MethodParameters<Func extends Fn> = [
  Func,
  Config,
  Parameters<Func>
];

export type Updater = () => void;

export type Memoized<Func extends Fn> = {
  updaters: Set<Updater>;
  cleanupTimeout?: ReturnType<typeof setTimeout>;
  //cancel?: ReturnType<typeof asyncIterator.return>
  cancel?: () => void;
  suspender?: any;
  value?: [any, AsyncReturnType<Func>?];
};

export type UseAsync<Func extends Fn> = AsyncReturnType<Func>;
export type Recall = Promise<void>;
export type UseAsyncSafe<Func extends Fn> = [
  null | any,
  AsyncReturnType<Func>?
];

export type UseAsyncLoadingState<Func extends Fn> =
  | {
      isLoading: true;
      data?: void;
    }
  | {
      isLoading: false;
      data: AsyncReturnType<Func>;
    };
export type UseAsyncSafeLoadingState<Func extends Fn> =
  | {
      isLoading: true;
      data: void;
      error: void;
    }
  | {
      isLoading: false;
      data?: AsyncReturnType<Func>;
      error: any;
    };

export type MethodReturnType<
  Method,
  Func extends Fn
> = Method extends "useAsync"
  ? UseAsync<Func>
  : Method extends "recall"
  ? Recall
  : Method extends "useAsyncSafe"
  ? UseAsyncSafe<Func>
  : Method extends "useAsyncLoadingState"
  ? UseAsyncLoadingState<Func>
  : Method extends "useAsyncSafeLoadingState"
  ? UseAsyncSafeLoadingState<Func>
  : never;

// https://www.jpwilliams.dev/how-to-unpack-the-return-type-of-a-promise-in-typescript
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
