import { notFound } from "assert-response";

export async function clientLoader() {
  notFound(true);
}

export default () => null;
