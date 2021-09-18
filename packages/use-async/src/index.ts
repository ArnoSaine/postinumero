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

// https://www.jpwilliams.dev/how-to-unpack-the-return-type-of-a-promise-in-typescript
export type AsyncReturnType<T extends (...args: any) => any> = T extends (
  ...args: any
) => Promise<infer U>
  ? U
  : T extends (...args: any) => infer U
  ? U
  : any;
