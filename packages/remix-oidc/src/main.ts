import remixPreset from "./remixPreset.js";
import vitePlugin from "./vitePlugin.js";

export default async function remixOidc(configFile = "remix-oidc.config.js") {
  return {
    remixPreset: remixPreset(configFile),
    vitePlugin: await vitePlugin(configFile),
  };
}
