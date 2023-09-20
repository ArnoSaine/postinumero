import { LoaderFunctionArgs } from "@remix-run/node";
import loadMessages from "../loadMessages";
import withIntlProvider from "../withIntlProvider";

declare var root: any;

export const loader = async (args: LoaderFunctionArgs) =>
  loadMessages(args, {
    loader: root.loader,
    locale: "fi-DEFAULT",
  });

export default withIntlProvider(root.default);

export const ErrorBoundary =
  root.ErrorBoundary && withIntlProvider(root.ErrorBoundary);
