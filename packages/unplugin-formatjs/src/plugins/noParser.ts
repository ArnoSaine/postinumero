import type { UnpluginFactory } from "unplugin";
import { createUnplugin } from "unplugin";

export type NoParserOptions = boolean;

export const unpluginFactory: UnpluginFactory<
  NoParserOptions | undefined,
  false
> = () => ({
  name: "@postinumero/unplugin-formatjs/no-parser",
  enforce: "pre",
  resolveId:
    process.env.NODE_ENV === "production"
      ? (id) => {
          if (id === "@formatjs/icu-messageformat-parser") {
            return require.resolve(
              "@formatjs/icu-messageformat-parser/no-parser",
            );
          }
        }
      : undefined,
});

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory);

export default unplugin;
