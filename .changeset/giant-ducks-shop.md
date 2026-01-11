---
"@postinumero/react-router-oidc-client": patch
---

- **Deprecation:** `withAuthErrorBoundary` signature has been changed from ~~`withAuthErrorBoundary(Unauthorized, ErrorBoundary)`~~ to `withAuthErrorBoundary(ErrorBoundary, { Unauthorized })`
- Add way to set error fallbacks for token verification error state and logging out state
