---
"@postinumero/remix-react-intl": patch
---

Remove fallback messages from `withIntlProvider`

Root `ErrorBoundary` should not use `intl` as the messages won't be localized anyway.
