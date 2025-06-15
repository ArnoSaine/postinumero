# @postinumero/react-router-formatjs

## Install

```sh
npm i @postinumero/react-router-formatjs react-intl
```

`vite.config.ts`:

```ts
import formatjs from "@postinumero/react-router-formatjs/vite";

export default defineConfig({
  plugins: [formatjs()],
  build: {
    target: "ES2022", // For top level await
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "ES2022", // For top level await
    },
  },
});
```

`.gitignore`:

```sh
# FormatJS
/.lang
/lang/.extracted.json
```

`app/routes.ts`:

```ts
import intlRoutes from "@postinumero/react-router-formatjs/routes";
import { type RouteConfig, index } from "@react-router/dev/routes";

export default intlRoutes([index("routes/home.tsx")] satisfies RouteConfig);
```

`app/root.tsx`:

```tsx
import { withLayoutIntlProvider } from "@postinumero/react-router-formatjs";
import { useIntl } from "react-intl";

export const Layout = withLayoutIntlProvider(function Layout({ children }) {
  const { locale } = useIntl();

  return <html lang={locale}>...</html>;
});
```

`tsconfig.json`:

```json
{
  "include": [
    "node_modules/@postinumero/react-router-formatjs/types/react-intl.d.ts"
  ]
}
```

## Usage

You can use `react-intl` components and hooks as you normally would:

### Example: Using `<FormattedMessage>`

```tsx
import { FormattedMessage } from "react-intl";

<FormattedMessage defaultMessage="Hello" />;
```

### Example: Using `useIntl`

```ts
import { useIntl } from "react-intl";

const intl = useIntl();
intl.formatMessage({ defaultMessage: "Hello" });
```

### Accessing `intl` in Actions & Loaders

In `action`, `loader`, `clientAction`, and `clientLoader`, you can access the `intl` object (`IntlShape`) via `loadIntl`:

```ts
import { loadIntl } from "@postinumero/react-router-formatjs";

const action = async (args: Route.ActionArgs) => {
  const intl = await loadIntl(args);

  const successMessage = intl.formatMessage({
    defaultMessage: "Operation was successful!",
  });
};
```

### Accessing `intl` in `meta` Functions

In `meta` functions, you can access the `intl` object (`IntlShape`) via `metaIntl`:

```ts
import { metaIntl } from "@postinumero/react-router-formatjs";

export function meta(args: Route.MetaArgs) {
  const intl = metaIntl(args);

  return [
    {
      title: intl.formatMessage({
        defaultMessage: "New React Router App",
        description: "Home page title",
      }),
    },
  ];
}
```

## API

### `useOptions`

Get access to fully resolved options. Example:

```ts
import { useOptions } from "@postinumero/react-router-formatjs";

const { availableLocales } = useOptions();
```

### `<LocaleSelect>`

Render a `select` component to change the requested locale.

```tsx
import { LocaleSelect } from "@postinumero/react-router-formatjs";

<LocaleSelect />;
```

### `<SetLocaleButton>`

Render a `button` component to set the requested locale.

```tsx
import { SetLocaleButton } from "@postinumero/react-router-formatjs";

<SetLocaleButton value="fi" />;
```

### `CONFIG`

Override the [default configuration](src/options.ts#L97-L115).

```ts
import { CONFIG } from "@postinumero/react-router-formatjs";

CONFIG.strategies.requestedLocales = [
  "searchParams",
  "sessionStorage",
  "acceptLanguageHeader",
  "navigatorLanguages",
];
```

## Add Translations

`lang/[environment:]<locale>.json`:

```json
{
  "UXCtM4": {
    "defaultMessage": "Example.com: What's next?",
    "description": "List of resources"
  }
}
```

See [`@postinumero/formatjs-tools` Config](../formatjs-tools#config-1) for more information.
