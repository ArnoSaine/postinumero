export const asyncFilter = async <T>(
  arrayPromise: T[] | Promise<T[]>,
  predicate: (entry: T) => Promise<boolean>,
) => {
  const array = await arrayPromise;
  const results = await asyncMap(array, predicate);
  return array.filter((_, index) => results[index]);
};

export const asyncMap = async <T, U>(
  arrayPromise: T[] | Promise<T[]>,
  mapFn: (entry: T) => Promise<U>,
) => Promise.all((await arrayPromise).map(mapFn));

export const flatMap = <T>(values: T[]) => values.flatMap.bind(values);

export const map = <T>(values: T[]) => values.map.bind(values);
