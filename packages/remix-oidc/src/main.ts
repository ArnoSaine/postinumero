import remixPreset from "./remixPreset.js";
import vitePlugin from "./vitePlugin.js";

export const name = "@postinumero/remix-oidc";

export default async function remixOidc(configFile = "remix-oidc.config.js") {
  return {
    remixPreset: remixPreset(configFile),
    vitePlugin: await vitePlugin(configFile),
  };
}
