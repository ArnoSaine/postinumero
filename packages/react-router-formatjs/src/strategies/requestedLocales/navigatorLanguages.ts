import type { RequestedLocalesStrategy } from "../../options.ts";

export const clientLoader: RequestedLocalesStrategy["clientLoader"] = () =>
  navigator.languages;
