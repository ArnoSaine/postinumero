import type { AsyncLocalStorage } from "node:async_hooks";
import isServer from "./isServer.ts";

// Create AsyncLocalStorage or a proxy that throws errors on usage in non-server environments
export default function createAsyncLocalStorage<T>(
  ...args: ConstructorParameters<typeof AsyncLocalStorage>
) {
  return isServer
    ? new (process.getBuiltinModule("node:async_hooks").AsyncLocalStorage)<T>(
        ...args,
      )
    : (new Proxy({} as any, {
        get() {
          return () => {
            throw new Error(
              "AsyncLocalStorage is not available in the current environment",
            );
          };
        },
      }) as AsyncLocalStorage<T>);
}
