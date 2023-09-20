import { NumberParam } from 'use-query-params';
import useQueryParamWithDefaultValue from '@postinumero/use-query-param-with-default-value';

export default function usePagerQueryParam(name) {
  const defaultValue = 1;
  const [value, setValue] = useQueryParamWithDefaultValue(
    defaultValue,
    name,
    NumberParam
  );
  const zeroBasedValue = value - 1;
  const setZeroBasedValue = (zeroBasedValue, ...rest) =>
    setValue(zeroBasedValue + 1, ...rest);
  return [zeroBasedValue, setZeroBasedValue];
}
