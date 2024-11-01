import { ModifierOption } from "./plugin/modifierHandlers";
import { SourceOption } from "./plugin/sourceHandlers";

export interface Options {
  importPath?: string;

  // Sources
  file?: string | false;
  global?: string | false;
  fetch?: string | false;
  sources?: SourceOption[];

  // Modifiers
  stripPrefix?: string | false;
  parseJsonValue?: false;
  unflat?: false;
  modifiers?: ModifierOption[];
}
