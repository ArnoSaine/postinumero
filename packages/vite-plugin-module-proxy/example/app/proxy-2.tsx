import * as original from "@postinumero/vite-plugin-module-proxy/original";

export default function () {
  console.log("Proxy 2 start");
  const value = original.default();
  console.log("Proxy 2 end");
  return value + "2";
}

export const name = `Wrapped (${original.name})`;

export function Component() {
  return (
    <h1>
      <original.Component /> <small>(Wrapped in H1)</small>
    </h1>
  );
}
