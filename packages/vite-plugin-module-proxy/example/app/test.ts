import _ from "lodash-es";
import * as proxy1 from "./modules/some-library-proxy-1";
import * as proxy2 from "./modules/some-library-proxy-2";
import * as proxy3 from "./modules/some-library-proxy-3";
import * as proxy4 from "./modules/some-library-proxy-4";
import * as someLibrary from "app/some-library";

export default () => {
  console.log(_.VERSION === "4.17.21-proxy3-proxy2-proxy1", "_.VERSION");

  console.log(proxy1.id === "proxy-1", "proxy1.id");
  console.log(proxy2.id === "proxy-2", "proxy2.id");
  console.log(proxy3.id === "proxy-3", "proxy3.id");
  console.log(proxy4.id === "proxy-4", "proxy4.id");
  console.log((someLibrary.id as string) === "proxy-1", "some-library.id");
  console.log(someLibrary.default() === "original321", "Modified return value");
  console.log(
    (someLibrary.name as string) ===
      "Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)Wrapped (SOME-LIBRARY)",
    "Modified name",
  );

  console.log(someLibrary.other === "other value", "unmodified value");
};
