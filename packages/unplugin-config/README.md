# @postinumero/unplugin-config

A plugin for managing build-time and runtime configuration across multiple build tools, supporting key unflattening, JSON parsing, prefix removal, and merging of default, build-time, and runtime configuration sources.

## Setup with Build Tools

Add `@postinumero/unplugin-config` to your build tool’s configuration.

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Config from "@postinumero/unplugin-config/vite";

export default defineConfig({
  plugins: [
    Config({
      /* options */
    }),
  ],
});
```

[Example](./example/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Config from "@postinumero/unplugin-config/rollup";

export default {
  plugins: [
    Config({
      /* options */
    }),
  ],
};
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require("@postinumero/unplugin-config/webpack")({
      /* options */
    }),
  ],
};
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default defineNuxtConfig({
  modules: [
    [
      "@postinumero/unplugin-config/nuxt",
      {
        /* options */
      },
    ],
  ],
});
```

Supports both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite).

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require("@postinumero/unplugin-config/webpack")({
        /* options */
      }),
    ],
  },
};
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from "esbuild";
import Config from "@postinumero/unplugin-config/esbuild";

build({
  plugins: [
    Config({
      /* options */
    }),
  ],
});
```

<br></details>

## Usage

### Step 1: Define Default Configuration

Add a `config.json` file with default configuration values. This is also the base for TypeScript type declarations.

**Example: `config.json`**

```json
{
  "string": "hello",
  "boolean": false,
  "number": 123,
  "some": {
    "nested": {
      "value": "default value"
    },
    "other": "other default value"
  },
  "more": [123, "foo"]
}
```

### Step 2: Set Build-Time Configuration Overrides

Override specific config values at build time by defining environment variables.

**Example: `.env`**

```sh
VITE_string=build-time value
VITE_boolean=true
VITE_number=456
VITE_some.nested.value=some nested environment value
VITE_more=[456,"bar"]
```

### Step 3: Add Runtime Configuration Overrides

Add runtime config overrides by creating a `config.json` file in the project’s public directory. These values will be merged into the final configuration.

**Example: `public/config.json`**

```json
{
  "string": "runtime value",
  "more.2": 789
}
```

### Step 4: Import and Use Config

You can import configuration using different formats based on your project’s needs. Additionally, you can add type declarations.

#### Available Import Formats

| Format                       | Import Path       | Description                                                                                     |
| ---------------------------- | ----------------- | ----------------------------------------------------------------------------------------------- |
| [Awaited](#awaited)          | `~config`         | Direct access to config as an object. Requires support for top-level await.                     |
| [Promise](#promise)          | `~config/promise` | Config wrapped in a promise.                                                                    |
| [Ref](#ref)                  | `~config/ref`     | Reference-style access with `.ready` promise and `.current` as `null \| Config`.                |
| [Proxy](#proxy-experimental) | `~config/proxy`   | Experimental proxy-based config with `ready` promise to ensure data availability before access. |
| [Raw](#ref)                  | `~config/raw`     | Access raw, unprocessed config sources as an array.                                             |

#### Example Usage

```ts
// Import configuration in the format that suits your use case
import config from "~config"; // Requires support for top-level await

console.log(config.some.nested.value); // Access config properties directly
```

The following example configuration output demonstrates how values are merged across default, build-time, and runtime sources:

```json
{
  "string": "runtime value",
  "boolean": true,
  "number": 456,
  "some": {
    "nested": {
      "value": "some nested environment value"
    },
    "other": "other default value"
  },
  "more": [456, "bar", 789]
}
```

#### Type Declarations for TypeScript

To use config imports with TypeScript, add one or more of the following declarations based on the desired formats:

```ts
// config.d.ts
type Config = typeof import("./config.json");

declare module "~config" {
  const config: Config;
  export default config;
}

declare module "~config/promise" {
  const config: Promise<Config>;
  export default config;
}

declare module "~config/ref" {
  const config: {
    ready: Promise<void>;
    current: Config | null;
  };
  export default config;
}

declare module "~config/proxy" {
  const config: Config;
  export default config;
  export const ready: Promise<void>;
}

declare module "~config/raw" {
  const config: (Config | Promise<Config>)[];
  export default config;
}
```

## Options

### Option Types and Defaults

Configure sources and modifiers with defaults for a seamless setup.

| Option           | Type                 | Default                                       | Description                                                                                                                           |
| ---------------- | -------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `importPath`     | `string`             | `"~config"`                                   | Import path alias for the config.                                                                                                     |
| `file`           | `string \| false`    | `"config.json"`                               | File source for config.                                                                                                               |
| `global`         | `string \| false`    | `"process.env"` (`"import.meta.env"` in Vite) | Environment variable source.                                                                                                          |
| `fetch`          | `string \| false`    | `"config.json"`                               | URL or path to fetch config from. In the case of a relative path, it will be prefixed with `import.meta.env.BASE_URL` (if available). |
| `stripPrefix`    | `string \| false`    | `"VITE_"` (in Vite) `"FARM_"` (in Farm)       | Prefix to remove from config variable names.                                                                                          |
| `parseJsonValue` | `undefined \| false` | `undefined` (enabled by default)              | Whether to parse JSON values from config variable values.                                                                             |
| `unflat`         | `undefined \| false` | `undefined` (enabled by default)              | Whether to unflat config variable names.                                                                                              |
| `sources`        | `SourceOption[]`     | Defined below                                 | Config sources that are merged from left to right.                                                                                    |
| `modifiers`      | `ModifierOption[]`   | Defined below                                 | Config transformations that are run in given order before configs are merged.                                                         |

#### Default Sources

```ts
[
  ["file", options.file],
  ["global", options.global],
  ["fetch", options.fetch],
];
```

#### Default Modifiers

```ts
[
  ["strip-prefix", options.stripPrefix],
  ["parse-json-values", options.parseJsonValue],
  ["unflat", options.unflat],
];
```

### Options as Search Parameters

You can also set options directly in the import path by adding them as search parameters. If any search parameter is specified in the import path, all default options and plugin configuration options are bypassed, and only the search parameters are used.

Example:

```ts
import config from "~config?file=config-a.json&file=config-b.json&global=import.meta.env&strip-prefix=VITE_";

console.log(config);
```

## Formats

Configuration can be accessed in different formats depending on your project’s needs.

### Awaited

This format requires support for top-level await.

```ts
import config from "~config";

console.log(config.some.nested.value);
```

### Promise

This format returns a promise that resolves to the configuration object.

```ts
import configPromise from "~config/promise";

async function func() {
  const config = await configPromise;

  console.log(config.some.nested.value);
}
```

### Ref

This format provides a reference object that can be accessed synchronously. Initially, `current` is `null` until the config is ready.

```ts
import configRef from "~config/ref";

function func() {
  const config = configRef.current; // null | Config

  console.log(config?.some.nested.value);
}

async function otherFunc() {
  await configRef.ready;

  const config = configRef.current!; // Config is ready

  console.log(config.some.nested.value);
}
```

### Proxy (Experimental)

This experimental format uses a proxy to access the configuration. It throws an error if the configuration is accessed before it is ready.

```ts
import config, { ready } from "~config/proxy";

console.log(config.some.nested.value); // May throw an error if accessed too early

async function func() {
  await ready;

  console.log(config.some.nested.value); // Safe to access after `ready` resolves
}
```

### Raw

Access raw configuration data as an array without processing.

```ts
import raw from "~config/raw";

async function func() {
  const configs = await Promise.all(raw);

  console.log(configs); // [defaults, env, runtime]
}
```
