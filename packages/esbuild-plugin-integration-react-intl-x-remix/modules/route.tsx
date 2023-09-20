import { LoaderFunctionArgs } from "@remix-run/node";
import loadMessages from "../loadMessages";
import withIntlProvider from "../withIntlProvider";

declare var route: any;

export const loader = async (args: LoaderFunctionArgs) =>
  loadMessages(args, {
    loader: route.loader,
    locale: "fi-DEFAULT",
    routeFile: "app/routes/dii.tsx",
  });

export default withIntlProvider(route.default);

export const ErrorBoundary =
  route.ErrorBoundary && withIntlProvider(route.ErrorBoundary);
