import { FormatOptions } from ".";
import modifierHandlers, { ModifierName } from "../plugin/modifierHandlers";
import { Options } from "../types";

export default async function promise(
  options: Options,
  { query, search }: FormatOptions,
) {
  const searchParams = new URLSearchParams(search);
  if (searchParams.size) {
    options.modifiers = [];
    for (const [name, value] of searchParams) {
      if (name in modifierHandlers) {
        const modifier = modifierHandlers[name as ModifierName];
        if (typeof modifier === "string") {
          options.modifiers.push(name as any);
        } else {
          options.modifiers.push([name as any, value]);
        }
      }
    }
  }

  const resolvedModifiers = options
    .modifiers!.map((modifier) => {
      if (typeof modifier === "string") {
        return modifierHandlers[modifier];
      } else {
        const [name, value] = modifier;
        return modifierHandlers[name](value);
      }
    })
    .filter(Boolean);

  return `import parseJsonValues from "@postinumero/config/utils/parseJsonValues";
import unflat from "@postinumero/config/utils/unflat";
import { flow, map, merge } from "lodash-es";
import raw from "${options.importPath}/raw${query}";

export default (async () => 
  merge({}, ...map((await Promise.all(raw)).filter(Boolean), flow(${resolvedModifiers})))
)();`;
}
