# @postinumero/remix-react-intl

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
