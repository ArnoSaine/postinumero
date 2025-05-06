import type { UnpluginFactory, UnpluginOptions } from "unplugin";
import { createUnplugin } from "unplugin";
import { unpluginFactory as babel } from "./plugins/babel.js";
import { unpluginFactory as noParser } from "./plugins/noParser.js";
import { unpluginFactory as processMessages } from "./plugins/processMessages.ts";
import { unpluginFactory as swc } from "./plugins/swc.js";
import type { Options } from "./types.ts";

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options = {},
  meta,
) => {
  options.babel ??= {};
  options.noParser ??= true;
  options.processMessages ??= {};
  options.swc ??= false;

  const plugins: UnpluginOptions[] = [];

  if (options.babel) {
    plugins.push(babel(options.babel, meta));
  }

  if (options.noParser) {
    plugins.push(noParser(options.noParser, meta));
  }

  if (options.processMessages) {
    plugins.push(processMessages(options.processMessages, meta));
  }

  if (options.swc) {
    plugins.push(swc(options.swc, meta));
  }

  return plugins;
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
