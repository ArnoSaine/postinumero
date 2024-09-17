import * as someLibrary from "app/some-library";

export default () => someLibrary.default() + "1";

export const name = someLibrary.name.repeat(4);

export const id = "proxy-1";
