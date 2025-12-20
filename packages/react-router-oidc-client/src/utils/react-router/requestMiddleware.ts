import type { MiddlewareFunction } from "react-router";
import isServer from "../isServer.ts";
import createAsyncLocalStorageContext from "./createAsyncLocalStorageContext.ts";

export const asyncRequestStorage = createAsyncLocalStorageContext<Request>();

export const provideRequest = asyncRequestStorage.run.bind(asyncRequestStorage);

export const request = isServer
  ? new Proxy<Request>({} as Request, {
      get(_, prop) {
        return asyncRequestStorage.get()[prop as keyof Request];
      },
      has(_, prop) {
        return prop in asyncRequestStorage.get();
      },
    })
  : undefined;

export const requestMiddleware: MiddlewareFunction<Response> = (
  { request },
  next,
) => provideRequest(request, next);

export default requestMiddleware;
