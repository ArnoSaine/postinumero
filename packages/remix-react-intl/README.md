# @postinumero/remix-react-intl

FormatJS (react-intl) & Remix integration

## Setup

`vite.config.ts`:

```js
import remixReactIntl from "@postinumero/remix-react-intl";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const intl = await remixReactIntl({
  // SPA mode is also available
  // ssr: false,
});

export default defineConfig({
  plugins: [
    remix({
      presets: [intl.remixPreset],
      // SPA mode is also available
      // ssr: false,
    }),
    tsconfigPaths(),
    intl.vitePlugin,
  ],
});
```

`.gitignore`:

```sh
# ssr: true
/.compiled-lang
# ssr: false
/public/.compiled-lang

/lang/en-default.json
```
