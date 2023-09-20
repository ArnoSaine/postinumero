import babel from "@babel/core";
import { name } from "@postinumero/esbuild-plugin-utils";
import fs from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";

const require = createRequire(import.meta.url);

async function transform(filename, ext) {
  const plugins = [];

  if (ext === "ts") {
    plugins.push("@babel/syntax-typescript");
  }
  if (ext === "tsx") {
    plugins.push(["@babel/syntax-typescript", { isTSX: true }]);
  }

  const babelOptions = babel.loadOptions({
    compact: false,
    presets: ["@twoday/formatjs"],
    plugins,
    filename,
    caller: {
      name: "@postinumero/esbuild-plugin-react-intl",
      supportsStaticESM: true,
    },
  });

  if (babelOptions.sourceMaps) {
    babelOptions.sourceFileName = path.relative(process.cwd(), filename);
  }

  const { code } = await babel.transformAsync(
    await fs.readFile(filename, "utf8"),
    babelOptions
  );

  return code;
}

export default async (onLoadOptions) => ({
  name: await name(import.meta.url),
  setup(build) {
    build.onLoad(
      {
        filter: /.*\.[jt]sx?$/,
        //filter: /.*[\\/](app|packages)[\\/].*\.[jt]sx?$/,
        ...onLoadOptions,
      },
      async (args) => {
        const loader = path.extname(args.path).slice(1);
        const contents = await transform(args.path, loader);
        const resolveDir = path.dirname(args.path);

        return {
          contents,
          loader,
          resolveDir,
        };
      }
    );

    if (build.initialOptions.minify) {
      build.onResolve(
        { filter: /^@formatjs\/icu-messageformat-parser$/ },
        () => ({
          path: require.resolve("@formatjs/icu-messageformat-parser/no-parser"),
        })
      );
    }
  },
});
