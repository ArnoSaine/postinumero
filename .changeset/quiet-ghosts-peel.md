---
"@postinumero/remix-react-intl": minor
---

@postinumero/remix-react-intl:

- Include `defaultLocale`, `localePreference` & `requestedLocales` in loader data for easier access
- Add hooks `useDefaultLocale`, `useLocalePreference` & `useRequestedLocales`
- Remove `options.route`. Intercept an existing action function to change the locale preference.
