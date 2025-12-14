import { parse } from "../cookie.ts";

export default async function getTokenFromRequest(request: Request) {
  const cookieHeader = request.headers.get("Cookie");
  const token = await parse(cookieHeader);
  return typeof token === "string" ? token : null;
}
