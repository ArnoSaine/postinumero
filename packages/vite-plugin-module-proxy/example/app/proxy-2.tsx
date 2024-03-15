import * as proxy3 from "./proxy-3";
import * as someLibrary from "./some-library";

console.log(proxy3 === someLibrary, "p3");

export default function () {
  console.log("Proxy 2 start");
  const value = someLibrary.default();
  console.log("Proxy 2 end");
  return value + "2";
}

export const name = `Wrapped (${someLibrary.name})`;

export function Component() {
  return (
    <h1>
      <someLibrary.Component /> <small>(Wrapped in H1)</small>
    </h1>
  );
}
