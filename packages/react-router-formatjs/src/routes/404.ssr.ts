import { type LoaderFunction } from "react-router";
import { clientLoader } from "./404.ts";

export * from "./404.ts";
export { default } from "./404.ts";

export const loader = clientLoader as LoaderFunction;
