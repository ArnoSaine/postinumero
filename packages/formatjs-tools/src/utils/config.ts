import { uniq } from "lodash-es";

export const emptyArrayFallback = <T>(array: T[], fallbackArray: T[]) =>
  array.length > 0 ? array : fallbackArray;

type Filter<T> = {
  include: T[];
  exclude: T[];
};

export type ListOrFilter<T> = T[] | Filter<T>;

export function filterBy<T>(array: T[], filter?: ListOrFilter<T>) {
  if (Array.isArray(filter)) {
    return filter;
  }
  if (filter?.include) {
    array = [...array, ...filter.include];
  }
  if (filter?.exclude) {
    array = array.filter((item) => !filter.exclude.includes(item));
  }
  return uniq(array);
}
