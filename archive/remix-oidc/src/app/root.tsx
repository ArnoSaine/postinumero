import {
  ClientLoaderFunction,
  ClientLoaderFunctionArgs,
  json,
} from "@remix-run/react";
import React from "react";
import { userManager } from "../index.js";
import { useListenChanges } from "../utils.js";
import { handleSigninCallback } from "./routes/signin/utils.js";
import {
  useDeleteSignoutIntentSearchParam,
  useHandleSignout,
} from "./routes/signout/utils.js";

const _loader = async (args: ClientLoaderFunctionArgs) => {
  await handleSigninCallback(args);
  return (await userManager)?.getUser();
};

export const withLoader = (loader?: ClientLoaderFunction) =>
  Object.assign(
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
        },
    {
      hydrate: true,
    } as const,
  );

export const withApp = (Component: React.ComponentType) =>
  function WithApp() {
    useListenChanges();
    useDeleteSignoutIntentSearchParam();

    return <Component />;
  };

export const withErrorBoundary = (
  Component: React.ComponentType = () => null,
) =>
  function WithErrorBoundary() {
    useListenChanges();
    useHandleSignout();

    return <Component />;
  };
