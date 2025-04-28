import { processMessages } from "@postinumero/formatjs-tools/commands";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";
import { Options } from "../types.ts";

export const unpluginFactory: UnpluginFactory<
  Exclude<Options["processMessages"], false> | undefined,
  false
> = (options = {}) => {
  return {
    name: "@postinumero/unplugin-formatjs/process-messages",
    async buildStart() {
      await processMessages();
    },
  };
};

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
