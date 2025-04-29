import { BabelOptions } from "./plugin/babel.ts";
import { NoParserOptions } from "./plugin/noParser.ts";
import { ProcessMessagesOptions } from "./plugin/processMessages.ts";
import { SWCOptions } from "./plugin/swc.ts";

export interface Options {
  babel?: BabelOptions | false;
  noParser?: NoParserOptions | false;
  processMessages?: ProcessMessagesOptions | false;
  swc?: SWCOptions | false;
}
