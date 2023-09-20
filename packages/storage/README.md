# @postinumero/storage

## Example

```js
import useLocalStorageJson from "@postinumero/storage/useLocalStorageJson";

export default function MyComponent() {
  const [checked = false, setChecked] = useLocalStorageJson("checked");
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => setChecked(event.target.checked)}
    />
  );
}
```

## Hooks to read and write values

Read-write hooks return `[value, setValue]` type response. `setValue` in JSON hooks takes optional `replacer` and `space` arguments.

### `useLocalStorage(keyName)`

### `useLocalStorageJson(keyName[, reviver])`

### `useSessionStorage(keyName)`

### `useSessionStorageJson(keyName[, reviver])`

## Hooks to read values

### `useLocalStorageValue(keyName)`

Get value from `localStorage` across browser tabs.

### `useLocalStorageJsonValue(keyName[, reviver])`

Get parsed JSON value or `undefined` from `localStorage` across browser tabs.

### `useSessionStorageValue(keyName)`

Get value from `sessionStorage`.

### `useSessionStorageJsonValue(keyName[, reviver])`

Get parsed JSON value or `undefined` from `sessionStorage`.

## Other

### `localStorage`

Same as `window.localStorage`, except updates hooks in all tabs (also current).

### `localStorageJson`

Same as `@postinumero/storage/localStorage`, except parses/stringifies JSON values. `getItem` & `setItem` take optional JSON parse/stringify arguments: `getItem(key[, reviver])`, `setItem(key, value[, replacer[, space]])`.

### `sessionStorage`

Same as `window.sessionStorage`, except updates hooks.

### `sessionStorageJson`

Same as `@postinumero/storage/sessionStorage`, except parses/stringifies JSON values. `getItem` & `setItem` take optional JSON parse/stringify arguments: `getItem(key[, reviver])`, `setItem(key, value[, replacer[, space]])`
