import { replace } from "react-router";
import { CONFIG, type RequestedLocalesStrategy } from "../../options.ts";

export const clientAction: RequestedLocalesStrategy["clientAction"] = (
  values,
  { currentUrl },
) => {
  currentUrl.searchParams.delete(CONFIG.strategyTypeKeys.requestedLocales);
  values.filter(Boolean).forEach((locale) => {
    currentUrl.searchParams.set(
      CONFIG.strategyTypeKeys.requestedLocales,
      locale,
    );
  });
  throw replace(currentUrl.toString());
};

export const clientLoader: RequestedLocalesStrategy["clientLoader"] = (
  args,
) => {
  const url = new URL(args.request.url);
  const values = url.searchParams.getAll(
    CONFIG.strategyTypeKeys.requestedLocales,
  );
  return values.length ? values : [null];
};

export const action = clientAction as RequestedLocalesStrategy["action"];
export const loader = clientLoader as RequestedLocalesStrategy["loader"];
