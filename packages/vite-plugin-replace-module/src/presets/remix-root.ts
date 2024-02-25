import remixResolveConfigPath from "@postinumero/vite-plugin-remix-resolve-config-path";
import { readConfig } from "@remix-run/dev/dist/config.js";
import path from "node:path";
import invariant from "tiny-invariant";
import replaceModule from "../main.js";

const remixRoot = async ({
  source = "./modules/~/root.js",
  url,
}: {
  source?: string;
  url: string;
}) => {
  const config = await readConfig();

  invariant(config.routes.root?.file, "root file");
  const pathname = new URL(source, url).pathname;

  return [
    replaceModule([
      {
        // "/app/root.tsx"
        source: new URL(
          path.join(
            " ",
            path.relative(config.rootDirectory, config.appDirectory),
            config.routes.root.file
          ),
          url
        ).pathname,
        pathname,
      },
      {
        // "./root.tsx"
        source: `.${
          new URL(path.join(" ", config.routes.root.file), url).pathname
        }`,
        pathname,
      },
    ]),
    remixResolveConfigPath,
  ];
};

export default remixRoot;
