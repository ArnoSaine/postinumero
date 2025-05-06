import { BabelOptions } from "./plugins/babel.ts";
import { NoParserOptions } from "./plugins/noParser.ts";
import { ProcessMessagesOptions } from "./plugins/processMessages.ts";
import { SWCOptions } from "./plugins/swc.ts";

export interface Options {
  babel?: BabelOptions | false;
  noParser?: NoParserOptions | false;
  processMessages?: ProcessMessagesOptions | false;
  swc?: SWCOptions | false;
}
