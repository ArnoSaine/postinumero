import { interpolateName } from "@formatjs/ts-transformer";
import { readConfig } from "@remix-run/dev/dist/config.js";
import { DEFAULT_ID_INTERPOLATION_PATTERN } from "babel-plugin-formatjs";
import getAllMessages from "./getAllMessages.js";

let isReadingConfig = false;

export async function readOriginalConfigRoutes() {
  if (isReadingConfig) {
    return [];
  }

  isReadingConfig = true;
  const config = await readConfig();
  isReadingConfig = false;

  return Object.values(config.routes).filter(({ index }) => !index);
}

export default async (messagesByLocale) => {
  const routes = await readOriginalConfigRoutes();

  messagesByLocale ??= await getAllMessages();

  return (route) => {
    routes
      .map((route) => ({
        ...route,
        // https://github.com/formatjs/formatjs/blob/51a42952e3898b2a00e1560d8accf1368c0eb52a/packages/cli-lib/src/extract.ts#L125
        messageId: interpolateName(
          { resourcePath: route.file },
          DEFAULT_ID_INTERPOLATION_PATTERN,
          { content: `/${route.path}` }
        ),
      }))
      .flatMap(({ messageId, ...route }) =>
        messagesByLocale.map(([locale, messages]) => ({
          ...route,
          locale,
          path: messages[messageId]?.defaultMessage.slice(1),
        }))
      )
      .filter(({ path }) => path)
      .filter(({ path }) => !routes.some((route) => route.path === path))
      .forEach(({ file, id, locale, path }) => {
        route(path, file, {
          id: `${locale}:${id}`,
        });
      });
  };
};
