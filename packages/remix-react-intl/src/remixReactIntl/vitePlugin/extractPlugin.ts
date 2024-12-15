import { ExtractOpts, extract as formatjsExtract } from "@formatjs/cli-lib";
import { RemixConfig } from "@remix-run/dev/dist/config.js";
import fg from "fast-glob";
import { exec } from "node:child_process";
import fs from "node:fs/promises";
import type { Plugin, UserConfig } from "vite";
import cacheOperation from "../../utils/cacheOperation.js";
import { name } from "./index.js";
import { Options } from "./optionsPlugin.js";

export interface RemixUserConfig extends UserConfig {
  __remixPluginContext: {
    remixConfig: RemixConfig;
  };
}

export default function extractPlugin(options: Options): Plugin {
  return {
    name: `${name}/extract`,
    async config(config) {
      if (!(config as RemixUserConfig).__remixPluginContext) {
        return;
      }
      const { remixConfig } = (config as RemixUserConfig).__remixPluginContext;
      const file = `${options.target}/${options.defaultLocale}.json`;

      const routeIds = Object.values(remixConfig.routes).map(
        (route) => route.id,
      );

      await cacheOperation(
        async () => {
          const [allMessages, routeNameMessages] = await Promise.all([
            extractAllMessages(remixConfig.appDirectory, options.extract),
            extractRoutes(options.extract, routeIds),
          ]);

          await fs.mkdir(options.target, { recursive: true });

          await fs.writeFile(file, mergeJSON(allMessages, routeNameMessages));
        },
        {
          name: "extracting messages",
          outputs: [file],
          inputs: [remixConfig.appDirectory],
          dependencies: [options.extract, routeIds],
        },
      );
    },
  };
}

export const dts = "**/*.d.ts";

const extractAllMessages = async (
  appDirectory: string,
  extractOpts: ExtractOpts,
) =>
  formatjsExtract(
    await fg(`${appDirectory}/**/*.{j,t}s{,x}`, {
      ignore: [dts],
    }),
    extractOpts,
  );

const extractRoutes = async (extractOpts: ExtractOpts, routeIds: string[]) =>
  new Promise<string>((resolve, reject) => {
    const child = exec(
      `node --input-type=module --eval 'import { extract } from "@formatjs/cli-lib";

process.stdout.write(await extract([], ${JSON.stringify({
        ...extractOpts,
        extractSourceLocation: false,
        readFromStdin: true,
      })}));'`,
      (error, success) => {
        if (error) {
          reject(error);
        } else {
          resolve(success);
        }
      },
    );

    child.stdin!.write(
      routeIds
        .map(
          (routeId) =>
            `defineMessage({defaultMessage:"${routeId}",description:{format:"route"}})`,
        )
        .join(";"),
    );

    child.stdin!.end();
  });

const mergeJSON = (...texts: string[]) =>
  JSON.stringify(
    Object.assign({}, ...texts.map((text) => JSON.parse(text))),
    null,
    2,
  );
