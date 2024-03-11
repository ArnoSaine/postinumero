import * as original from "@postinumero/vite-plugin-module-proxy/original";

export default function () {
  console.log("Proxy 3 start");
  const value = original.default();
  console.log("Proxy 3 end");
  return value + "3";
}

export const name = original.name.repeat(4);
