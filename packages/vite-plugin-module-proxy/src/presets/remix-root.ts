import remixRoute from "./remix-route.js";

const remixRoot = async ({
  proxy = "../modules/~/root",
  url,
}: {
  proxy?: string | Promise<string>;
  url: string;
}) => remixRoute({ proxy, url, routeId: "root" });

export default remixRoot;
