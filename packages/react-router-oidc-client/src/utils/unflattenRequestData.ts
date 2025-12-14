import { unflatten } from "flat";

export default function unflattenRequestData(data: FormData | URLSearchParams) {
  return unflatten(Object.fromEntries(data)) as Record<string, any>;
}
