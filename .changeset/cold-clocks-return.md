---
"@postinumero/react-router-oidc-client": minor
---

- **Breaking:** Renamed `withHandleAuthErrorBoundary` to `withAuthErrorBoundary`
- **Breaking:** Renamed `oidc_ssr_middleware` to `oidcSsrMiddleware`
- **Breaking:** Renamed `oidc_ssr_clientMiddleware` to `oidcSsrClientMiddleware`
- **Breaking:** Renamed `useOIDC` to `useProvider`

- **Breaking:** Renamed default export to named export `authRoutes` in  
  `@postinumero/react-router-oidc-client/routes`

- **Breaking:** Replaced `loadOIDCRoot` with  
  `import { loader as loadOidcProvider } from "@postinumero/react-router-oidc-client/[keycloak/]routes/provider.{ssr|spa}"`

- **Fix:** Various SSR-related fixes
