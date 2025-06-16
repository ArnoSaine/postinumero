import { CONFIG } from "@postinumero/react-router-formatjs/config";
import { type UIMatch } from "react-router";
import type { clientLoader } from "../routes/options.tsx";
import { defaultOptions } from "./create.ts";

const findMatch = (matches: UIMatch[]) =>
  (matches as UIMatch<Awaited<ReturnType<typeof clientLoader>>>[]).find(
    (match) => match.id === CONFIG.route.id,
  );

export const getOptionsFromMatches = (matches: UIMatch[]) =>
  findMatch(matches)?.data ?? defaultOptions;
