import options from "@postinumero/remix-react-intl/options.server";
import { LoaderFunctionArgs } from "@remix-run/node";
import fs from "node:fs/promises";
import path from "node:path";
import { MessageFormatElement } from "react-intl";
import { getSession } from "./sessions.js";

// function fromFlatRoute(routeId: string) {
//   if (routeId === "root") {
//     return "";
//   }
//   routeId = routeId.slice("routes/".length);

//   return (
//     routeId
//       // Escaped special characters
//       .split(/\[(.*?)\]/g)
//       .map((part, index) =>
//         index % 2
//           ? // Escaped
//             part
//           : // Normal route segment
//             part
//               .replaceAll(".", "/")
//               .replaceAll("$", ":")
//               // Pathless Routes
//               .replaceAll(/_\w+/g, "")
//               .replaceAll("(", "")
//               .replaceAll(")", "?")
//               .replaceAll("//", "/"),
//       )

//       .join("")
//   );
// }

//   const remixConfig = await readConfig();

//   const paths = Object.values(remixConfig.routes).map((route) => route.id).map(fromFlatRoute);
//   console.log(new URL(request.url).pathname);

// console.log(matchRoutes([{ path: "" }], "/"));
// console.log(matchPath(paths, "/"));

export const loader = async (routeId: string, args: LoaderFunctionArgs) => {
  const session = await getSession(args.request.headers.get("Cookie"));

  let locale = session.get("locale") as string;

  if (!options.locales.includes(locale)) {
    locale = options.fallbackLocale;
  }

  const messages = JSON.parse(
    await fs.readFile(
      path.join(options.compiledTarget, locale, `${routeId}.json`),
      "utf-8",
    ),
  ) as Record<string, MessageFormatElement[]>;

  return { locale, messages };
};
