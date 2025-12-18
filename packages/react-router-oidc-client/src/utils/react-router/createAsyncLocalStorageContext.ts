import createAsyncLocalStorage from "../createAsyncLocalStorage.ts";

export default function createAsyncLocalStorageContext<T>(defaultValue?: T) {
  const asyncLocalStorage = createAsyncLocalStorage<T>({ defaultValue });

  return {
    get() {
      const value = asyncLocalStorage.getStore();
      if (value === undefined) {
        throw new Error(
          "Value is not available in the current context. Please use `run` or `defaultValue` to provide the value.",
        );
      }
      return value;
    },
    run: asyncLocalStorage.run.bind(asyncLocalStorage),
  };
}
