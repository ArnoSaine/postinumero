# @postinumero/remix-oidc

## Usage

`oidc-client.config.ts`:

```ts
import { UserManagerSettings, WebStorageStateStore } from "oidc-client-ts";

export const userManagerSettings: UserManagerSettings = {
  authority: "http://localhost:8080/realms/demo",
  client_id: "demo",
  userStore: new WebStorageStateStore({ store: localStorage }),
  redirect_uri: location.href,
};
```

`vite.config.ts`:

```ts
import oidc from "@postinumero/remix-oidc";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    remix(),
    tsconfigPaths(),
    oidc({
      // configFile: "oidc-client.config.ts"
    }),
  ],
});
```

`app/root.tsx`:

```tsx
export const clientLoader = () => null;
// ...
```
