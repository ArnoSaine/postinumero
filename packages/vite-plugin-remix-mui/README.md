# @postinumero/vite-plugin-remix-mui

## Setup

```js
import mui from "@postinumero/vite-plugin-remix-mui";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix({
      // SPA mode is also available
      // ssr: false,
    }),
    tsconfigPaths(),
    mui,
  ],
});
```
