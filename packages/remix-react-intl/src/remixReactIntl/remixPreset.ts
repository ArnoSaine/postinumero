import type { Preset, VitePluginConfig } from "@remix-run/dev";
import { name } from "../remixReactIntl.js";

export default function remixPreset(
  resolveRemixUserConfig: (remixUserConfig: VitePluginConfig) => void,
): Preset {
  return {
    name,
    remixConfig({ remixUserConfig }) {
      resolveRemixUserConfig(remixUserConfig);
      return {};
    },
  };
}
