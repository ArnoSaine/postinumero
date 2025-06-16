import { type UIMatch } from "react-router";
import { CONFIG } from "../config.ts";
import type { clientLoader } from "../routes/options.tsx";
import { defaultOptions } from "./create.ts";

const findMatch = (matches: UIMatch[]) =>
  (matches as UIMatch<Awaited<ReturnType<typeof clientLoader>>>[]).find(
    (match) => match.id === CONFIG.route.id,
  );

export const getOptionsFromMatches = (matches: UIMatch[]) =>
  findMatch(matches)?.data ?? defaultOptions;
