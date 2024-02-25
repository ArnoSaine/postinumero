# @postinumero/vite-plugin-replace-module

Replace modules

## Example

```js
import replaceModule from "@postinumero/vite-plugin-replace-module";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    replaceModule([
      {
        source: "some-module",
        pathname: "./modules/customized-module",
      },
    ]),
  ],
});
```
