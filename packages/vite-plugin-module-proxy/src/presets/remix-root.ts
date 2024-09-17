import remixRoute from "./remix-route.js";

const remixRoot = ({
  handler = "../modules/~/root",
  base,
}: {
  handler?: string | Promise<string>;
  base?: string;
}) => remixRoute({ handler, base, routeId: "root" });

export default remixRoot;
