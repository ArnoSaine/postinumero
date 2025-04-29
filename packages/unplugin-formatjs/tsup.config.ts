import type { Options } from "tsup";

export default <Options>{
  entry: ["src/*.ts"],
  clean: true,
  format: ["cjs", "esm"],
  dts: true,
  cjsInterop: true,
  splitting: true,
  // For Babel
  banner: ({ format }) => {
    if (format === "esm")
      return {
        js: `import { createRequire } from 'module'; const require = createRequire(import.meta.url);`,
      };
    return {};
  },
};
