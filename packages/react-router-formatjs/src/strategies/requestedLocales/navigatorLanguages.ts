import type { RequestedLocalesStrategy } from "@postinumero/react-router-formatjs/config";

export const clientLoader: RequestedLocalesStrategy["clientLoader"] = () =>
  navigator.languages;
