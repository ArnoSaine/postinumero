import { ClientLoaderFunctionArgs } from "@remix-run/react";

export const loadRequestedLocales = async (_args: ClientLoaderFunctionArgs) =>
  navigator.languages;
