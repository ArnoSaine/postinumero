# @postinumero/vite-plugin-remix-mui

## Setup

```js
import mui from "@postinumero/vite-plugin-remix-mui";
import { unstable_vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths(), mui],
});
```