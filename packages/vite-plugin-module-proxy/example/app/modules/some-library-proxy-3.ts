import * as someLibrary from "app/some-library";

export default () => someLibrary.default() + "3";

export const name = `Wrapped (${someLibrary.name})`;

export const id = "proxy-3";
