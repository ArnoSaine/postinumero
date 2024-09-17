import * as someLibrary from "app/some-library";

export default () => someLibrary.default() + "2";

export function Component() {
  return (
    <h1>
      <someLibrary.Component /> <small>(Wrapped in H1)</small>
    </h1>
  );
}

export const id = "proxy-2";
