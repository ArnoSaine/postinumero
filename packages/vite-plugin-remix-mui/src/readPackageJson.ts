import fs from "node:fs/promises";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export default async function readPackageJson(name: string) {
  return JSON.parse(
    await fs.readFile(require.resolve(`${name}/package.json`), "utf-8"),
  );
}
