import type { UnpluginFactory, UnpluginOptions } from "unplugin";
import { createUnplugin } from "unplugin";
import { unpluginFactory as processMessages } from "./plugin/processMessages.ts";
import { unpluginFactory as swc } from "./plugin/swc.js";
import type { Options } from "./types.ts";

export const unpluginFactory: UnpluginFactory<Options | undefined> = (
  options = {},
  meta,
) => {
  options.swc ??= {};
  options.processMessages ??= {};

  const plugins: UnpluginOptions[] = [];

  if (options.swc) {
    plugins.push(swc(options.swc, meta));
  }

  if (options.processMessages) {
    plugins.push(processMessages(options.processMessages, meta));
  }

  return plugins;
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
