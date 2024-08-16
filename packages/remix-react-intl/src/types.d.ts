declare module "@postinumero/remix-react-intl" {
  const main = await import("./main.js");
  export const name = main.name;
  export default main.default;
}

declare module "virtual:@postinumero/remix-react-intl/options" {
  const options: import("./vitePlugin/optionsPlugin.js").PublicOptions;
  export default options;
}

declare module "virtual:@postinumero/remix-react-intl/options.server" {
  const options: import("./vitePlugin/optionsPlugin.js").Options;
  export default options;
}
