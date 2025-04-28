# @postinumero/config

Configuration management utility for handling environment variables and runtime configurations.

See also [@postinumero/unplugin-config](../unplugin-config).

## Usage

To use the configuration utility, simply import the desired source and format:

```ts
import config from "@postinumero/config/file/global/fetch/awaited";
//                                      ^^^^^^^^^^^^^^^^^ ^^^^^^^
//                                      Sources           Format

console.log(config);
```

### Sources

The configuration is derived from multiple sources. These sources are merged recursively, with priority given to sources listed later in the import path.

#### `file`

This source reads configuration at runtime from `/config.json`.

```ts
import config from "@postinumero/config/file/awaited";
```

#### `global`

The `global` source allows you to access configuration values directly from environment variables. By default it reads values from `process.env`. Variable names are unflattened into nested objects, and JSON values are parsed when possible.

**Example environment variables:**

```sh
foo=true
some.list=[1,2,3]
some.list.1.prop=123
```

```ts
import config from "@postinumero/config/global/awaited";

console.log(config.foo); // true
console.log(config.some.list); // [1, { prop: 123 }, 3]
```

#### `fetch`

This source fetches configuration at runtime from `/config.json`.

```ts
import config from "@postinumero/config/fetch/awaited";
```

### Formats

Configuration can be accessed in different formats depending on your project’s needs.

#### `awaited`

Uses top-level `await`. This format requires an ES2022 target in your `vite.config.ts`:

```json
{
  // ...
  "build": {
    "target": "ES2022"
  }
}
```

Example usage:

```ts
import config from "@postinumero/config/**/awaited";

console.log(config.some.value);
```

#### `promise`

This format returns a promise that resolves to the configuration object:

```ts
import configPromise from "@postinumero/config/**/promise";

async function func() {
  const config = await configPromise;

  console.log(config.some.value);
}
```

#### `ref`

This format provides a reference object that can be accessed synchronously. Initially, `current` is `null` until the config is ready.

```ts
import configRef from "@postinumero/config/**/ref";

function func() {
  const config = configRef.current; // null | Config

  console.log(config?.some.value);
}

async function otherFunc() {
  await configRef.ready;

  const config = configRef.current!; // Config is ready

  console.log(config.some.value);
}
```

#### `proxy` (Experimental)

This experimental format uses a proxy to access the configuration. It throws an error if the configuration is accessed before it is ready.

```ts
import config, { ready } from "@postinumero/config/**/proxy";

console.log(config.some.value); // May throw an error if accessed too early

async function func() {
  await ready;

  console.log(config.some.value); // Safe to access after `ready` resolves
}
```

## Types

> ⚠️ Ensure that your environment variables, `.env` files, or `public/config.json` have the same structure as `config.example.json`. Inconsistent structures will result in incorrect type hints and potential runtime errors.

To ensure type safety:

1. Add a `config.example.json` file with example configuration values.
2. Add the following `.d.ts` declarations to your project:

   ```ts
   declare module "@postinumero/config/*/awaited" {
     const config: typeof import("./config.example.json");
     export default config;
   }

   declare module "@postinumero/config/*/promise" {
     const config: Promise<typeof import("./config.example.json")>;
     export default config;
   }

   declare module "@postinumero/config/*/ref" {
     const config: {
       ready: Promise<void>;
       current: null | typeof import("./config.example.json");
     };
     export default config;
   }

   declare module "@postinumero/config/*/proxy" {
     export const ready: Promise<void>;
     const config: typeof import("./config.example.json");
     export default config;
   }
   ```
