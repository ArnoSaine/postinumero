# @postinumero/remix-react-intl

FormatJS (react-intl) & Remix integration

## Setup

```js
import remixReactIntl from "@postinumero/remix-react-intl";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const intl = await remixReactIntl();

export default defineConfig({
  plugins: [
    remix({ presets: [intl.remixPreset] }),
    tsconfigPaths(),
    intl.vitePlugin,
  ],
});
```
