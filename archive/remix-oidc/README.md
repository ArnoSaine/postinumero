# @postinumero/remix-oidc

## Usage

`remix-oidc.config.js`:

```ts
import defineConfig from "@postinumero/remix-oidc/lib/defineConfig.js";
import { WebStorageStateStore } from "oidc-client-ts";

export default defineConfig({
  getUserManagerSettings: () => ({
    authority: "http://localhost:8080/realms/demo",
    client_id: "demo",
    userStore: new WebStorageStateStore({ store: localStorage }),
    redirect_uri: location.href,
  }),
});
```

`vite.config.ts`:

```ts
// For Node.js versions below 22, install and import the polyfill:
//import "core-js/proposals/promise-with-resolvers";

import remixOidc from "@postinumero/remix-oidc";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const oidc = await remixOidc(/* "remix-oidc.config.js" */);

export default defineConfig({
  plugins: [
    remix({
      ssr: false,
      presets: [oidc.remixPreset],
    }),
    tsconfigPaths(),
    oidc.vitePlugin,
  ],
});
```

`app/root.tsx`:

```tsx
export const clientLoader = () => null;
// ...
```
