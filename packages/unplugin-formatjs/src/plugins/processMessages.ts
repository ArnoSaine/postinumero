import {
  processMessages,
  type ProcessMessagesOptions,
} from "@postinumero/formatjs-tools/commands/process-messages";
import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

export { ProcessMessagesOptions };

export const unpluginFactory: UnpluginFactory<
  ProcessMessagesOptions | undefined,
  false
> = (options = {}) => ({
  name: "@postinumero/unplugin-formatjs/process-messages",
  async buildStart() {
    await processMessages(options);
  },
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
