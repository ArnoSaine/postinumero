# @postinumero/vite-plugin-remix-resolve-config-path

Import from Remix config paths

## Setup

```js
import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [remixResolveConfigPath],
});
```

## Example

```js
// Import the root
import * as root from "@postinumero/vite-plugin-remix-resolve-config-path/${path.join(config.appDirectory, config.routes.root.file)}";
// Or import using one of the presets
import * as root from "@postinumero/vite-plugin-remix-resolve-config-path/preset/root";
```

## Available variables

| Name       | Value                                     |
| ---------- | ----------------------------------------- |
| `config`   | Remix Config                              |
| `importer` | `importer` from Rollup's `resolveId` hook |
| `path`     | `node:path`                               |
