import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const importer = require.resolve("@mui/material/styles/useThemeProps");

export const originalModule = "./defaultTheme";

export const filterFn = (onResolveArgs) => onResolveArgs.importer === importer;
