import { readConfig } from "@remix-run/dev/dist/config.js";

const config = await readConfig();

// Apply this plugin only when the importer is the server entry point
export const filterFn = ({ importer }) =>
  importer === config.entryServerFilePath;
