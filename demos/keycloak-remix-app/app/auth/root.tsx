import {
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  json,
} from "@remix-run/react";
import { loadUser } from ".";
import { handleSigninCallback } from "./signin/utils";
import {
  useDeleteSignoutIntentSearchParam,
  useHandleSignout,
} from "./signout/utils";
import { useListenChanges } from "./utils";

const _loader = async (args: ClientLoaderFunctionArgs) => {
  await handleSigninCallback(args);
  return await loadUser();
};

export const withLoader = (loader?: ClientLoaderFunction) =>
  loader
    ? async (args: ClientLoaderFunctionArgs) => {
        const user = await _loader(args);
        const response = await loader(args);
        if (response) {
          if (response instanceof Response) {
            return json({ ...(await response.json()), user }, response);
          }
          return json({ ...response, user });
        }
        return json({ user });
      }
    : async (args: ClientLoaderFunctionArgs) => {
        const user = await _loader(args);
        return json({ user });
      };

export const withApp = (Component: React.ComponentType) =>
  function WithApp() {
    useListenChanges();
    useDeleteSignoutIntentSearchParam();

    return <Component />;
  };

export const withErrorBoundary = (Component: React.ComponentType) =>
  function WithErrorBoundary() {
    useListenChanges();
    useHandleSignout();

    return <Component />;
  };
