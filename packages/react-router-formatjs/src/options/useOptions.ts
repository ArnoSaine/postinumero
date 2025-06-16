import { useMatches } from "react-router";
import { getOptionsFromMatches } from "./getOptionsFromMatches.ts";

export const useOptions = () => getOptionsFromMatches(useMatches());
