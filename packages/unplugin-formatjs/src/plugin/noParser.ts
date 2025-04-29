import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

export type NoParserOptions = boolean;

export const unpluginFactory: UnpluginFactory<
  NoParserOptions | undefined,
  false
> = () => ({
  name: "@postinumero/unplugin-formatjs/no-parser",
  enforce: "pre",
  resolveId(id) {
    if (id === "@formatjs/icu-messageformat-parser") {
      return require.resolve("@formatjs/icu-messageformat-parser/no-parser");
    }
  },
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
