declare module "@postinumero/remix-react-intl/options" {
  const options: import("./vitePlugin/optionsPlugin.ts").PublicOptions;
  export default options;
}

declare module "@postinumero/remix-react-intl/options.server" {
  const options: import("./vitePlugin/optionsPlugin.ts").Options;
  export default options;
}
