# @postinumero/use-query-param-with-default-value

Like `useQueryParam` from [use-query-params](https://www.npmjs.com/package/use-query-params), but if current value is same as the default, param is removed from the URL.

## Install

```sh
npm install @postinumero/use-query-param-with-default-value use-query-params query-string
```

## Example

```js
import useQueryParamWithDefaultValue from '@postinumero/use-query-param-with-default-value';
import { BooleanParam } from 'use-query-params';
// …
const defaultValue = 1;
const [myBoolean, setMyBoolean] = useQueryParamWithDefaultValue(
  defaultValue,
  'myBoolean',
  BooleanParam
);
```
