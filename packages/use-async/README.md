# @postinumero/use-async

Create a suspending hook from an async function, an async generator or a function that returns an async iterator.

- Uses [memoizee](https://www.npmjs.com/package/memoizee) and [json-stable-stringify](https://www.npmjs.com/package/json-stable-stringify) as a normalizer to cache resolved/yielded values
- `recall` function for re-executing the function and rerendering related components from anywhere

## Examples

### Get data using axios

```js
import { Suspense } from 'react';
import { create } from '@postinumero/use-async';
import axios from 'axios';

const [useAxios] = create(axios);

function Todo({ id }) {
  const { data } = useAxios(`https://jsonplaceholder.typicode.com/todos/${id}`);

  return <pre>{JSON.stringify(data, null, 2)}</pre>;
}

function App() {
  return (
    <Suspense fallback="Loading...">
      <Todo id="1" />
    </Suspense>
  );
}
```

### Render timestamps with setInterval

```js
import { Suspense } from 'react';
import { create } from '@postinumero/use-async';
import { Repeater } from '@repeaterjs/repeater';

const [useTimestamp] = create(
  () =>
    new Repeater(async (push, stop) => {
      push(Date.now());
      const interval = setInterval(() => push(Date.now()), 1000);
      await stop;
      clearInterval(interval);
    })
);

function Timestamp() {
  return <div>Timestamp: {useTimestamp()}</div>;
}

function App() {
  return (
    <Suspense fallback="Loading...">
      <Timestamp />
    </Suspense>
  );
}
```

## API

### `create(fn[, config])`

For creating shortcut functions of the rest of the API, without needing to pass `fn` and `config` each time.

#### Params

- `fn: AsyncFunction`
- `config`: Memoizee configuration overrides (optional)

#### Returns

An array of functions `[useAsync, recall, useAsyncSafe]`. Each of the returned function take just the `...args` as its arguments.

### `useAsync(fn[, config[, args]])`

#### Params

- `fn: AsyncFunction`
- `config`: Memoizee configuration overrides (optional)
- `args: arguments[]` for `fn` (optional)

#### Returns

Resolved value of `fn(...args)`.

#### Throws

A thrown exception from `fn` or a promise for React Suspense.

### `useAsyncSafe(fn[, config[, args]])`

#### Params

- `fn: AsyncFunction`
- `config`: Memoizee configuration overrides (optional)
- `args: arguments[]` for `fn` (optional)

#### Returns

An array `[error, value]`, where `error` is either `null` or a thrown exception from `fn(...args)`, and `value` is resolved value of `fn(...args)`.

#### Throws

Promise for React Suspense.

### `recall(fn[, config[, args]])` (async)

If there are components currently mounted using any of the hooks and the same arguments (fn, config, args), `fn(...args)` gets called. When `fn` resolves, components will rerender with the new value.

#### Params

- `fn: AsyncFunction`
- `config`: Memoizee configuration overrides (optional)
- `args: arguments[]` for `fn` (optional)

#### Returns

Resolves with `undefined`, when `fn(...args)` resolves.

## Not ready for Suspense?

Import from `@postinumero/use-async/loading-state` to use the `{ isLoading, data, error }` style API. Example:

```js
import { create } from '@postinumero/use-async/loading-state';
import axios from 'axios';

const [, , useAxiosSafe] = create(axios);

function User({ id }) {
  const { isLoading, data, error } = useAxiosSafe(`/api/users/${id}`);

  if (isLoading) {
    return 'Loading...';
  }

  return <div>First name: {data.data.first_name}</div>;
}
```
