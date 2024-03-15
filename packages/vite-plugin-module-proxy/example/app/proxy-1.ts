import * as proxy2 from "./proxy-2";
import * as someLibrary from "./some-library";

console.log(proxy2 === someLibrary, "p2");

export default function () {
  console.log("Proxy 1 start");
  const value = someLibrary.default();
  console.log("Proxy 1 end");
  return value + "1";
}

export const name = someLibrary.name.repeat(4);
