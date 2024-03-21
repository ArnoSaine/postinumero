import remixRoute from "./remix-route.js";

const remixRoot = async ({
  proxy: proxyOption = "../modules/~/root",
  url,
}: {
  proxy?: string;
  url: string;
}) =>
  remixRoute({
    proxy: proxyOption,
    url,
    routeId: "root",
  });

export default remixRoot;
