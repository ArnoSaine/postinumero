/// <reference types="@postinumero/vite-plugin-remix-resolve-config-path/src/types.d.ts" />

declare module "virtual:remix-oidc/config" {
  const config: import("./configFinal").Config;
  export default config;
}
