import type { UserManagerSettings } from "oidc-client-ts";
import userConfig from "@postinumero/remix-oidc/user-config";
import finalConfig from "./finalConfig.js";

const defaults = {
  routes: {
    home: "/",
    signin: "/signin",
    signout: "/signout",
  },
};

type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

type Defaults = typeof defaults;

export type UserConfig = DeepPartial<Defaults> & ConfigReguired;
export type FinalConfig = Defaults & ConfigReguired;

interface ConfigReguired {
  getUserManagerSettings: () => UserManagerSettings;
}

const config = finalConfig(userConfig);

export default config;
