# @postinumero/formatjs-helpers

## Components

### `<FormattedDateTime>`

```tsx
import { FormattedDateTime } from "@postinumero/formatjs-helpers";

const date = new Date();

<FormattedDateTime value={date} />; // 6/14/2025, 3:00 PM
```

### `<FormattedMessageValue>`

Renders a translated message from a given message map using its key. If the key is not found in the messages, the key itself is displayed as a fallback.

```tsx
import { FormattedMessageValue } from "@postinumero/formatjs-helpers";
import { defineMessages } from "react-intl";

const optionMessages = defineMessages({
  foo: { defaultMessage: "Foo" },
  bar: { defaultMessage: "Bar" },
});
const value = "foo";

<FormattedMessageValue optionMessages={optionMessages} value={value} />; // Foo
```

## Hooks

### `useFormatDateTime`

```tsx
import { useFormatDateTime } from "@postinumero/formatjs-helpers";

const date = new Date();

const formatDateTime = useFormatDateTime();
formatDateTime(date); // 6/14/2025, 3:00 PM
```

### `useFormatMessageValue`

Returns a translated message from a given message map using its key. If the key is not found in the messages, the key itself is displayed as a fallback.

```tsx
import { useFormatMessageValue } from "@postinumero/formatjs-helpers";
import { defineMessages } from "react-intl";

const optionMessages = defineMessages({
  foo: { defaultMessage: "Foo" },
  bar: { defaultMessage: "Bar" },
});
const value = "foo";

const formatMessageValue = useFormatMessageValue();
formatMessageValue(optionMessages, value); // Foo
```

### `useFormatMessageNoFallbackOnMissingString`

Workaround to prevent message id values ​​from being used in the generated `index.html` file when using SPA mode in production.

```ts
import { useFormatMessageNoFallbackOnMissingString } from "@postinumero/formatjs-helpers";
import { defineMessage } from "react-intl";

const title = useFormatMessageNoFallbackOnMissingString(
  defineMessage({
    defaultMessage: "Example",
  }),
);
```

## Other

### `formatNumberBytesArgs`

Convert a byte value into a more human-readable format using appropriate units (byte, kilobyte, megabyte, etc.).

```ts
import { formatNumberBytesArgs } from "@postinumero/formatjs-helpers";

intl.formatNumber(
  ...formatNumberBytesArgs(4700, {
    notation: "compact",
    style: "unit",
  }),
); // 4.6 kB
```
