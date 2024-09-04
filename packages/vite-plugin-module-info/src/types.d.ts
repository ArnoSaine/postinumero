declare module "@postinumero/vite-plugin-module-info" {
  export * from "./main.js";
  const main: (typeof import("./main.js"))["default"];
  export default main;

  // Virtual module
  export const importer: string | undefined;
  export const url: URL | undefined;
}
