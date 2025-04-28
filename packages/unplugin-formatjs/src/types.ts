import { Options as BabelPluginOpts } from "babel-plugin-formatjs/types.js";

export interface Options {
  swc?: BabelPluginOpts | false;
  processMessages?: {} | false;
}
