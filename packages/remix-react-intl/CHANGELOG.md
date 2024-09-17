# @postinumero/remix-react-intl

## 0.2.5

### Patch Changes

- 590b370: Fix extracting and compiling messages when any Vite build config is defined

## 0.2.4

### Patch Changes

- 408e3ef: Fix usage under a public base path

## 0.2.3

### Patch Changes

- 12536f6: Fix dynamic imports of locale preference methods

## 0.2.2

### Patch Changes

- 7d4ed66: Fix enabling SPA mode when using per route messages
- 250af99: Fix hydration error: If exists, export `HydrateFallback` wrapped in `withIntlProvider`
- 5c18608: Ensure `lang` directory exists
- Updated dependencies [8c1afcd]
- Updated dependencies [176b7c3]
  - @postinumero/vite-plugin-module-proxy@0.2.0
  - @postinumero/vite-plugin-remix-resolve-config-path@0.1.2

## 0.2.1

### Patch Changes

- 024f615: Add option: `_loaderDataName`
- aa585ba: Fix memoization of messages
- Updated dependencies [0fe770a]
  - @postinumero/vite-plugin-module-info@0.2.0

## 0.2.0

### Minor Changes

- 3095078: Move Vite plugin and Remix preset to `@postinumero/remix-react-intl/remixReactIntl`

  - Add `package.json` `exports`
  - Remove `lib/` and `.js` from import paths

- a55b0c8: @postinumero/remix-react-intl:

  - Include `defaultLocale`, `localePreference` & `requestedLocales` in loader data for easier access
  - Add hooks `useDefaultLocale`, `useLocalePreference` & `useRequestedLocales`
  - Remove `options.route`. Intercept an existing action function to change the locale preference.

- 51d3076: Use `ssr` option value from Remix preset config

  - Prefix some options with "\_" to mark them "private"

- fd8a4d9: Remove `@formatjs/intl-durationformat` from dependencies

### Patch Changes

- d421509: Modify Vite config:

  - Add `@postinumero/remix-react-intl` to `optimizeDeps.exclude` and `ssr.noExternal`

- d7210d5: Fix reading messages from file in SSR mode
- 59bdd1e: Add `metaInlt` for accessing `intl` in `meta` Functions
- 40bda9c: Move SPA mode route to `route.spa.ts`
- c3e5ab6: Use @mjackson/headers to get requested locales from the `Accept-Language` header
- 7e2b7ea: Remove fallback messages from `withIntlProvider`

  Root `ErrorBoundary` should not use `intl` as the messages won't be localized anyway.

- e7ee105: Update typings
- 7038af4: Memoize reading message files
- Updated dependencies [811d60e]
  - @postinumero/vite-plugin-module-proxy@0.1.2

## 0.1.1

### Patch Changes

- 9796fba: @postinumero/remix-react-intl updates:

  - Rename `@postinumero/remix-react-intl/options` to `virtual:@postinumero/remix-react-intl/options`
  - Fix virtual module types
  - Add `useIntlDurationFormat` util
  - Improve locale matching
  - Option `singleOutput`:
    - Adds support to load all messages in the root loader or per each route
  - Get the default `fallbackLocale` option from the `defaultLocale` option
  - LocaleForm: submit on change
  - Example, LocaleSelector:
    - Highlight current locale preference
    - Use `Intl.DisplayNames`

- e25a837: Add `loadIntl` util
- f7e3834: @postinumero/remix-react-intl updates:

  - Rename LocaleForm to LocalePreferenceForm
  - Examples: Include default locale name in "Browser Default" button label
  - Add `loadDefaultLocale` util

## 0.1.0

### Minor Changes

- @postinumero/remix-react-intl

### Patch Changes

- Updated dependencies
  - @postinumero/vite-plugin-remix-resolve-config-path@0.1.1
  - @postinumero/vite-plugin-module-proxy@0.1.1
  - @postinumero/vite-plugin-module-info@0.1.0
