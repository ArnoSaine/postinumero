# @postinumero/remix-react-intl

integrate [FormatJS (react-intl)](https://formatjs.io/) with [Remix](https://remix.run/) for internationalization in your project

## Setup

To get started, configure your `vite.config.ts`:

```ts
import remixReactIntl from "@postinumero/remix-react-intl";
import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const intl = await remixReactIntl();

export default defineConfig({
  plugins: [
    remix({
      presets: [intl.remixPreset],
      // Enable SPA mode by setting ssr to false
      // ssr: false,
    }),
    tsconfigPaths(),
    intl.vitePlugin,
  ],
});
```

Next, update your `.gitignore` file to exclude generated language files:

```sh
# Server-side rendering (ssr) enabled
/.compiled-lang
# SPA mode (ssr: false)
public/.compiled-lang

/lang/en-default.json
```

`.eslintrc`:

```json
{
  "rules": {
    "import/no-unresolved": [
      "error",
      { "ignore": ["virtual:@postinumero/remix-react-intl/options"] }
    ]
  }
}
```

## Usage

You can use react-intl components and hooks as you normally would:

### Example: Using `<FormattedMessage>`

```tsx
import { FormattedMessage } from "react-intl";

// ...

<FormattedMessage defaultMessage="Welcome to FormatJS (react-intl) + Remix" />;
```

### Example: Using `useIntl`

```ts
import { useIntl } from "react-intl";

// ...

const intl = useIntl();

intl.formatMessage({ defaultMessage: "Hello" });
```

### Accessing `intl` in Actions & Loaders

In Remix actions, loaders, clientActions, and clientLoaders, you can access the `intl` object (`IntlShape`) via `loadIntl`:

```ts
import loadIntl from "@postinumero/remix-react-intl/lib/loadIntl";
import { ClientActionFunctionArgs } from "@remix-run/react";

const clientAction = async (args: ClientActionFunctionArgs) => {
  const intl = await loadIntl(args);

  const successMessage = intl.formatMessage({
    defaultMessage: "Operation was successful!",
  });

  // ...
};
```

## Managing Translations

Default messages are automatically extracted to `/lang/en-default.json`.

To add translations for other languages, manually create files in the `/lang` directory (e.g., `/lang/en.json`, `/lang/en-GB.json`, `/lang/fi-FI.json`). During the build process, messages are compiled. If a translation is missing, it falls back to the base language value or the default message if necessary.
