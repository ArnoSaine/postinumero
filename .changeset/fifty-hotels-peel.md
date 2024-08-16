---
"@postinumero/remix-react-intl": patch
---

@postinumero/remix-react-intl updates:

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
