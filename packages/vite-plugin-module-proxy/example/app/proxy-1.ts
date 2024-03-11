import * as original from "@postinumero/vite-plugin-module-proxy/original";

export default function () {
  console.log("Proxy 1 start");
  const value = original.default();
  console.log("Proxy 1 end");
  return value + "1";
}

export const name = original.name.toUpperCase();
