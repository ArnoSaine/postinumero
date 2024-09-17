# @postinumero/vite-plugin-module-proxy

Override module exports

## Usage

```js
import moduleProxy from "@postinumero/vite-plugin-module-proxy";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    moduleProxy({
      target: "some-module", // string | string[] | Promise
      handler: "./modules/some-module.tsx", // string | Promise
      // Optional. Default: `options.target`.
      // Set `false` to disable re-exporting.
      // Set `true` to disable re-exporting `default` and re-export only `*`.
      reExportAllFrom: "some-module", // boolean | string | Promise
    }),
  ],
});
```

`./modules/some-module.jsx`:

```tsx
// Reference to the original module. If there are subsequent proxies for
// the same module, this is a reference to the subsequent proxy.
import * as original from "some-module";

// Not needed. Named exports are re-exported from the original module or
// a subsequent proxy.
// export * from "some-module";

// Override the default export
export default function Component(props) {
  if (props.specialCase) {
    return <>Something else</>;
  }

  return <original.default {...props} />;
}

// Override other exports
export const x = original.x.toUpperCase();
```
