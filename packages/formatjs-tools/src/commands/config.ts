import dejarun from "dejarun";
import { ensureDir, writeJson } from "fs-extra/esm";
import { CONFIG_FILE, getConfig, HIDDEN_LANG_DIR } from "../config.ts";
import { defaults, type Options } from "../options.ts";

export interface ConfigOptions extends Options {}

export const config_raw = async ({
  logLevel = defaults.logLevel,
}: ConfigOptions = {}) => {
  await ensureDir(HIDDEN_LANG_DIR);
  await await writeJson(CONFIG_FILE, await getConfig(), { spaces: 2 });
};

export const config = async (options?: ConfigOptions) => {
  await dejarun("formatjs-tools config", async () => config_raw(options), {
    outputs: [CONFIG_FILE],
    dependencies: [await getConfig()],
    clean: options?.clean,
    logo: false,
  });
};
