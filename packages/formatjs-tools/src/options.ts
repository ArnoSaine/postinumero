import type { ParseArgsConfig } from "node:util";

export interface Options {
  logLevel?: "debug" | "info" | "warn" | "error";
  clean?: boolean;
}

export const defaults = {
  logLevel: "warn",
  clean: false,
} as const;

export const parseArgsConfig: ParseArgsConfig = {
  options: {
    "log-level": {
      type: "string",
      default: defaults.logLevel,
    },
    clean: {
      type: "boolean",
      default: defaults.clean,
    },
  },
  allowPositionals: true,
};
