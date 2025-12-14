import type { MiddlewareFunction } from "react-router";
import invariant from "tiny-invariant";
import isServer from "../isServer.ts";

const REQUEST =
  isServer &&
  new (process.getBuiltinModule(
    "node:async_hooks",
  ).AsyncLocalStorage)<Request>();

function getStorage() {
  invariant(
    REQUEST,
    "Request storage is not available in the current environment.",
  );
  return REQUEST;
}

export const provideRequest = async (
  request: Request,
  cb: () => Promise<Response>,
) => getStorage().run(request, cb);

export const getRequest = () => {
  const request = getStorage().getStore();
  invariant(
    request,
    "Request is not available in the current context. Please use requestMiddleware to provide the Request object.",
  );
  return request;
};

export const request = isServer
  ? new Proxy<Request>({} as Request, {
      get(_, prop) {
        return getRequest()[prop as keyof Request];
      },
      has(_, prop) {
        return prop in getRequest();
      },
    })
  : undefined;

export const requestMiddleware: MiddlewareFunction<Response> = async (
  { request },
  next,
) => provideRequest(request, next);

export default requestMiddleware;
