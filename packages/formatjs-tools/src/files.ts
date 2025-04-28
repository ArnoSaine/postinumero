import { emptyDir, pathExists, readJson, writeJson } from "fs-extra/esm";
import { join } from "node:path";
import { LOCALE_SEPARATOR } from "./config.ts";
import { asyncMap } from "./utils/array.ts";

export interface File {
  path: string;
  exists: boolean;
}

export interface LocaleFiles {
  locale: string;
  files: File[];
}

export interface EnvironmentFiles {
  name: string | undefined;
  locales: LocaleFiles[];
}

export const exists = async (path: string) => ({
  path,
  exists: await pathExists(path),
});

export const mergeJsonFiles = async (
  path: string,
  files: EnvironmentFiles[],
) => {
  await emptyDir(path);

  await asyncMap(files, (environment) =>
    asyncMap(environment.locales, async ({ locale, files }) =>
      writeJson(
        join(
          path,
          environment.name
            ? `${environment.name}${LOCALE_SEPARATOR}${locale}.json`
            : `${locale}.json`,
        ),
        Object.assign(
          {},
          ...(await asyncMap(
            files.filter(({ exists }) => exists),
            ({ path }) => readJson(path),
          )),
        ),
      ),
    ),
  );
};
