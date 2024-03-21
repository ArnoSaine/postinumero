# @postinumero/vite-plugin-module-info

Get current module info

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
import { id, url } from "virtual:@postinumero/vite-plugin-module-info";

console.log(id); // => string | undefined
console.log(url); // => URL | undefined
```
