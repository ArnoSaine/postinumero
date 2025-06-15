import type { RequestedLocalesStrategy } from "../../config.ts";

export const clientLoader: RequestedLocalesStrategy["clientLoader"] = () =>
  navigator.languages;
