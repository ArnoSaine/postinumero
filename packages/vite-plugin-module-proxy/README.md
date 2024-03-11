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
    }),
  ],
});
```

`./modules/some-module.jsx`:

```tsx
// Reference to the original module. If there are other plugins for the same module, this is a reference to the previous proxy.
import * as original from "@postinumero/vite-plugin-module-proxy/original";
// Same as `original`
import * as someModule from "some-module";

// Not needed. Everything is exported from the original module.
// export * from "@postinumero/vite-plugin-module-proxy/original";
// export * from "some-module";

// Override some exports
export default function Component(props) {
  if (props.specialCase) {
    return <>Something else</>;
  }

  return <original.default {...props} />;
}

export const x = original.x.toUpperCase();
```
