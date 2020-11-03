# @postinumero/use-query-param-with-default-value

Like `useQueryParam` from [use-query-params](https://www.npmjs.com/package/use-query-params), but if current value is same as the default, param is removed from the URL.

## Install

```sh
npm install use-query-params @postinumero/use-query-param-with-default-value
```

## Example

```js
import useQueryParamWithDefaultValue from '@postinumero/use-query-param-with-default-value';
import { BooleanParam } from 'use-query-params';
// …
const defaultValue = 1;
const [boolean, setBoolean] = useQueryParamWithDefaultValue(
  defaultValue,
  'boolean',
  BooleanParam
);
```
