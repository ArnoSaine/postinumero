import { findWorkspaces } from "find-workspaces";
import assert from "node:assert";
import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const workspaces = await findWorkspaces(rootDir);
assert(workspaces, "No workspaces found");

const missingBins = (
  await Promise.all(
    workspaces.map((ws) => {
      const pkg = ws.package;
      const pkgDir = ws.location;

      if (!pkg.bin) return;

      const binEntries =
        typeof pkg.bin === "string" ? { [pkg.name]: pkg.bin } : pkg.bin;

      return Promise.all(
        Object.entries(binEntries).map(async ([binName, relBinPath]) => {
          const fullPath = path.resolve(pkgDir, relBinPath);
          try {
            await fs.access(fullPath);
          } catch {
            return { binName, fullPath };
          }
        }),
      );
    }),
  )
)
  .flat()
  .filter(Boolean) as {
  binName: string;
  fullPath: string;
}[];

await Promise.all(
  missingBins.map(async ({ binName, fullPath }) => {
    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, "#!/usr/bin/env node\n// placeholder", {
      mode: 0o755,
    });
    console.log(`Created placeholder for ${binName} at ${fullPath}`);
  }),
);
