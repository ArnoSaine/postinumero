import { FinalConfig, UserConfig } from "./config.js";

const defaults = {
  routes: {
    home: "/",
    signin: "/signin",
    signout: "/signout",
  },
};

export default function finalConfig(config: UserConfig): FinalConfig {
  return {
    ...defaults,
    ...config,
    routes: {
      ...defaults.routes,
      ...config.routes,
    },
  };
}
