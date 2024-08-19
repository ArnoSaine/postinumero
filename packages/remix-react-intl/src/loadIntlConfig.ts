import { clientOnly$, serverOnly$ } from "vite-env-only";

const server = serverOnly$(
  async (
    ...args: Parameters<
      (typeof import("./intlConfig.server.js"))["loadIntlConfig"]
    >
  ) => (await import("./intlConfig.server.js")).loadIntlConfig(...args),
);

const client = clientOnly$(
  async (
    ...args: Parameters<
      (typeof import("./intlConfig.client.js"))["loadClientIntlConfig"]
    >
  ) => (await import("./intlConfig.client.js")).loadClientIntlConfig(...args),
);

const loadIntlConfig = (server ?? client)!;

export default loadIntlConfig;
