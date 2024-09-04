import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import finalConfig from "./finalConfig.js";

export default async function configFromFile(configFile: string) {
  return finalConfig(
    (await import(await resolveConfigFile(configFile))).default,
  );
}

export async function resolveConfigFile(configFile: string) {
  const { rootDirectory } = await readConfig();

  if (!path.isAbsolute(configFile)) {
    configFile = path.join(rootDirectory, configFile);
  }

  return configFile;
}
