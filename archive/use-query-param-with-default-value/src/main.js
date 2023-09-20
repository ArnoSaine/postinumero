import { isEqual } from 'lodash';
import { useQueryParam } from 'use-query-params';

export default function useQueryParamWithDefaultValue(defaultValue, ...rest) {
  const [paramValue, setParamValue] = useQueryParam(...rest);
  const value = paramValue ?? defaultValue;
  const setValue = (value, ...rest) => {
    setParamValue(isEqual(value, defaultValue) ? undefined : value, ...rest);
  };
  return [value, setValue];
}
