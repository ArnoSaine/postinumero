import type { Plugin } from "vite";

const mui: Plugin = {
  name: "remix-mui",
  config: (config) => {
    const onwarn =
      config.build?.rollupOptions?.onwarn ?? ((warning, warn) => warn(warning));

    config.build ??= {};
    config.build.rollupOptions ??= {};
    config.build.rollupOptions.onwarn = (warning, warn) => {
      if (
        warning.code === "MODULE_LEVEL_DIRECTIVE" &&
        warning.id?.includes("/node_modules/@mui/") &&
        warning.message.includes('"use client"')
      ) {
        return;
      }

      onwarn(warning, warn);
    };

    return {
      ssr: {
        noExternal: ["@mui/*", "@remix-run/*"],
      },
    };
  },
};

export default mui;
