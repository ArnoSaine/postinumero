# @postinumero/vite-plugin-remix-resolve-config-path

Import from Remix config paths

`node:path` as `path` and Remix Config as `config` are available.

## Example

```js
// Import the root
import * as root from "virtual:remix-resolve-config-path:${path.join(config.appDirectory, config.routes.root.file)}";
// Or import using one of the presest
import * as root from "virtual:remix-resolve-config-path:preset:root";
```

## Setup

```js
import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remixResolveConfigPath],
});
```
