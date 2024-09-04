# @postinumero/vite-plugin-module-info

Get build time module info

## Setup

```js
import moduleInfo from "@postinumero/vite-plugin-module-info";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [moduleInfo],
});
```

## Example

```js
import { importer, url } from "@postinumero/vite-plugin-module-info";

console.log(importer); // => string | undefined
console.log(url); // => URL | undefined
```
