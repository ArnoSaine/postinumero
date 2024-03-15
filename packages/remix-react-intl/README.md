# @postinumero/vite-plugin-remix-react-intl

FormatJS (react-intl) & Remix integration

## Setup

```js
import reactIntl from "@postinumero/vite-plugin-remix-react-intl";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [remix(), tsconfigPaths(), reactIntl],
});
```
