# @postinumero/vite-plugin-remix-mui

MUI & Remix integration

## Setup

```js
// For Node.js versions below 22, install and import the polyfill:
//import "core-js/proposals/promise-with-resolvers";

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
    mui(),
  ],
});
```

## Router integration is built-in

```tsx
import { Button, Link } from "@mui/material";

// ...

<Link href="/about" color="secondary">
  Go to the about page
</Link>;

<Button variant="contained" href="/">
  Go to the main page
</Button>;
```
