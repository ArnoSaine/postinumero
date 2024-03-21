import * as someLibrary from "./some-library";

export default function () {
  console.log("Proxy 3 start");
  const value = someLibrary.default();
  console.log("Proxy 3 end");
  return value + "3";
}

export const name = someLibrary.name.toUpperCase();
