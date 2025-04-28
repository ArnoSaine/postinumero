import { readFile } from "node:fs/promises";

async function tryReadConfig() {
  const path = "config.json";
  try {
    return JSON.parse(await readFile(path, "utf-8"));
  } catch {}
}

export default tryReadConfig();
