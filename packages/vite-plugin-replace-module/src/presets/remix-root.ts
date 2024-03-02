import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import moduleProxy from "../main.js";

const remixRoot = async ({
  proxy: proxyOption = "./modules/~/root",
  url,
}: {
  proxy?: string;
  url: string;
}) => {
  const config = await readConfig();

  invariant(config.routes.root?.file, "root file");

  const proxy = new URL(proxyOption, url).pathname;

  return [
    remixResolveConfigPath,
    moduleProxy({
      id:
        // "/absolute/path/to/app/root.tsx"
        new URL(path.join(config.appDirectory, config.routes.root.file), url)
          .pathname,
      proxy,
    }),
    moduleProxy({
      id:
        // "/app/root.tsx"
        new URL(
          path.join(
            " ",
            path.relative(config.rootDirectory, config.appDirectory),
            config.routes.root.file
          ),
          url
        ).pathname,
      proxy,
    }),
    moduleProxy({
      id:
        // "./root.tsx"
        `.${new URL(path.join(" ", config.routes.root.file), url).pathname}`,
      proxy,
    }),
  ];
};

export default remixRoot;
