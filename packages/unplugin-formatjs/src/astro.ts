import type { Options } from "./types.ts";

import unplugin from "./index.ts";

export default (options: Options): any => ({
  name: "@postinumero/unplugin-formatjs",
  hooks: {
    "astro:config:setup": async (astro: any) => {
      astro.config.vite.plugins ||= [];
      astro.config.vite.plugins.push(unplugin.vite(options));
    },
  },
});
