import { processMessages } from "@postinumero/formatjs-tools/commands/process-messages";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

export interface ProcessMessagesOptions {}

export const unpluginFactory: UnpluginFactory<
  ProcessMessagesOptions | undefined,
  false
> = () => ({
  name: "@postinumero/unplugin-formatjs/process-messages",
  async buildStart() {
    await processMessages();
  },
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
