# @postinumero/vite-plugin-remix-mui

MUI & Remix integration

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

## Router integration is built-in

```tsx
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";

<Link href="/about" color="secondary">
  Go to the about page
</Link>;

<Button variant="contained" href="/">
  Go to the main page
</Button>;
```
