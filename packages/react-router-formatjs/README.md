# @postinumero/react-router-formatjs

## Install

```sh
npm i @postinumero/react-router-formatjs react-intl
npm i @postinumero/unplugin-formatjs --save-dev
```

`vite.config.ts`:

```ts
import formatjs from "@postinumero/unplugin-formatjs/vite";

export default defineConfig({
  plugins: [formatjs()],
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
import { intlRoutes } from "@postinumero/react-router-formatjs";
import { type RouteConfig, index } from "@react-router/dev/routes";

export default intlRoutes([index("routes/home.tsx")] satisfies RouteConfig);
```

`app/root.tsx`:

```tsx
import {
  loadIntl,
  withLayoutIntlProvider,
} from "@postinumero/react-router-formatjs";
import { useIntl } from "react-intl";

import type { Route } from "./+types/root";

export async function loader(args: Route.ClientLoaderArgs) {
  const intl = await loadIntl(args);

  return {
    intl,
  };
}

export const Layout = withLayoutIntlProvider(function Layout({ children }) {
  const { locale } = useIntl();

  return <html lang={locale}>...</html>;
});
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

## Add Translations

`lang/[environment:]<locale>.json`:

```json
{
  "UXCtM4": {
    "defaultMessage": "Example.com: What's next?",
    "description": "List of resources"
  }
  // ...
}
```

See [`@postinumero/formatjs-tools` Config](../formatjs-tools#config-1) for more information.
