# @postinumero/unplugin-formatjs

Preconfigured. Minimal setup.

- Inject message IDs
- Remove `defaultMessage`s
- Use [`react-intl` without parser](https://formatjs.github.io/docs/guides/advanced-usage/#react-intl-without-parser-40-smaller)
- Extract and compile messages, optionally for each environment (see [`@postinumero/formatjs-tools`](../formatjs-tools))

## Install

```bash
npm i @postinumero/unplugin-formatjs --save-dev
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import formatjs from "@postinumero/unplugin-formatjs/vite";

export default defineConfig({
  plugins: [
    formatjs({
      /* options */
    }),
  ],
});
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import formatjs from "@postinumero/unplugin-formatjs/rollup";

export default {
  plugins: [
    formatjs({
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
    require("@postinumero/unplugin-formatjs/webpack")({
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
      "@postinumero/unplugin-formatjs/nuxt",
      {
        /* options */
      },
    ],
  ],
});
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require("@postinumero/unplugin-formatjs/webpack")({
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
import formatjs from "@postinumero/unplugin-formatjs/esbuild";

build({
  plugins: [formatjs()],
});
```

<br></details>

## Options

### `babel`

Passes options to [`babel-plugin-formatjs`](https://formatjs.github.io/docs/tooling/babel-plugin).

By default `preserveWhitespace` is `true`, and `removeDefaultMessage` is `true` in production.

Set `options.babel` to `false` to disable transforming source files.

See [`babel-plugin-formatjs`](https://formatjs.github.io/docs/tooling/babel-plugin) for other available options.

<!-- ### `swc`

Passes options to [`@swc/plugin-formatjs`](https://www.npmjs.com/package/@swc/plugin-formatjs).

By default `preserveWhitespace` is `true`, and `removeDefaultMessage` is `true` in production.

Set `options.swc` to `false` to disable transforming source files.

See [`babel-plugin-formatjs`](https://formatjs.github.io/docs/tooling/babel-plugin) for other available options. -->

### `processMessages`

Passes options to [`process-messages`](../formatjs-tools#process-messages).

By default, the application source code is expected to be in the `app` directory.

Set `options.processMessages` to e.g. `{ extract: { path: ["src"] } }` to override the default options.

Set `options.processMessages` to `false` to disable message extraction and compilation.

### `noParser`

By default `react-intl` [without parser](https://formatjs.github.io/docs/guides/advanced-usage#react-intl-without-parser-40-smaller) is used in production.  
Set `options.noParser` to `false` to use `react-intl` with parser.
