# @postinumero/vite-plugin-module-proxy

Override module exports

## Usage

```js
import moduleProxy from "@postinumero/vite-plugin-module-proxy";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    moduleProxy({
      id: "some-module",
      proxy: "./modules/some-module.tsx",
      reExportAllFrom: "some-module", // Optional. Default: `options.id`. Set `false` to disable re-exporting.
    }),
  ],
});
```

`./modules/some-module.jsx`:

```tsx
// Reference to the original module. If there are subsequent proxies for the same module, this is a reference to the subsequent proxy.
import * as someModule from "some-module";

// Not needed. Named exports are re-exported from the original module or a subsequent proxy.
// export * from "some-module";

// Default exports are not re-exported. If the module has default export, it must be re-exported of overwritten.
export { default } from "some-module";

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
