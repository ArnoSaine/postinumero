#!/usr/bin/env node

import { readConfig } from "@remix-run/dev/dist/config.js";
import { camelCase } from "lodash-es";
import fs from "node:fs/promises";
import path from "node:path";
import { readOriginalConfigRoutes } from "../defineTranslatedRoutes.js";

const config = await readConfig();
const routes = await readOriginalConfigRoutes();
const isTypeScript = Boolean(config.tsconfigPath);

await fs.writeFile(
  path.join(config.appDirectory, `paths.${isTypeScript ? "ts" : "js"}`),
  `// This file is generated from routes for path messages extraction.

import { defineMessage } from "react-intl";

${routes.map(({ id, path }) => {
  const object = `{ defaultMessage: "/${path}" }`;
  return `export const ${
    id === "root" ? id : camelCase(`path-${path}`)
  } = defineMessage(${object});`;
}).join(`
`)}
`
);
