import { readConfig } from "@remix-run/dev/dist/config.js";
import * as esbuild from "esbuild";
import fs from "fs-extra";
import { createRequire } from "node:module";
import path from "node:path";
import invariant from "tiny-invariant";
import type { Plugin } from "vite";
import mui from "./mui.js";

const require = createRequire(import.meta.url);

const config = await readConfig();

async function resolve(file: string) {
  for (const extension of ["js", "ts", "jsx", "tsx", "json"]) {
    const path = `${file}.${extension}`;
    if (await fs.pathExists(path)) {
      return path;
    }
  }
  return require.resolve(file);
}

invariant(config.routes.root?.file, "root file");

const rootFile = path.join(config.appDirectory, config.routes.root.file);
const virtualModuleId = "virtual:~/root";
const resolvedVirtualModuleId = "\0" + virtualModuleId;

const virtualRoot: Plugin = {
  name: `${mui.name}:virtual-root`,
  resolveId(source, importer) {
    if (source === virtualModuleId) {
      return resolvedVirtualModuleId;
    }
    // Resolve relative paths relative to the original file in the virtual module
    if (importer === resolvedVirtualModuleId) {
      if (source.startsWith(".")) {
        const originalDirname = path.dirname(rootFile);
        return resolve(path.join(originalDirname, source));
      }
    }
  },
  load(id) {
    if (id === resolvedVirtualModuleId) {
      return fs.readFile(rootFile, "utf-8");
    }
  },
  transform(code, id) {
    if (id === resolvedVirtualModuleId) {
      return esbuild.transform(code, {
        banner: `import * as React from "react";
    `,
        loader: "tsx",
        sourcemap: true,
      });
    }
  },
};

export default virtualRoot;
