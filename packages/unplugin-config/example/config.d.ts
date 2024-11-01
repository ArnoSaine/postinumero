type Config = typeof import("./config.json");

declare module "~config" {
  const config: Config;
  export default config;
}

declare module "~config/awaited" {
  const config: Config;
  export default config;
}

declare module "~config/promise" {
  const config: Promise<Config>;
  export default config;
}

declare module "~config/ref" {
  const config: {
    ready: Promise<void>;
    current: Config | null;
  };
  export default config;
}

declare module "~config/proxy" {
  const config: Config;
  export default config;
  export const ready: Promise<void>;
}

declare module "~config/raw" {
  const config: (Config | Promise<Config>)[];
  export default config;
}
