# @postinumero/react-router-oidc-client

## 0.4.1

### Patch Changes

- 40df651: Remove unnecessary delay in clientAction
- c507541: Use `resource-owner-credentials` as the default intent when username and password are provided
- 572c696: Make `getUser` available on the server

## 0.4.0

### Minor Changes

- c8d1dbd: - **Breaking:** Renamed `withHandleAuthErrorBoundary` to `withAuthErrorBoundary`
  - **Breaking:** Renamed `oidc_ssr_middleware` to `oidcSsrMiddleware`
  - **Breaking:** Renamed `oidc_ssr_clientMiddleware` to `oidcSsrClientMiddleware`
  - **Breaking:** Renamed `useOIDC` to `useProvider`
  - **Breaking:** Renamed default export to named export `authRoutes` in
    `@postinumero/react-router-oidc-client/routes`
  - **Breaking:** Replaced `loadOIDCRoot` with
    `import { loader as loadOidcProvider } from "@postinumero/react-router-oidc-client/[keycloak/]routes/provider.{ssr|spa}"`
  - **Fix:** Various SSR-related fixes

## 0.3.3

### Patch Changes

- 77d333a: Fix refreshing token when access token has expired

## 0.3.2

### Patch Changes

- a4b8d9a: Upgrade to `react-router@^7.9.1`
- 060a0bd: Add `unauthorized_client` to known login errors
- cdb97e1: Fix infinite redirect loop when IDP is unavailable

## 0.3.1

### Patch Changes

- 78de9e4: Revert relative paths (3565bef, 9abd3ab)

## 0.3.0

### Minor Changes

- 9abd3ab: Use relative paths for the login and logout routes

## 0.2.6

### Patch Changes

- a84e359: Fix infinite redirect when login succeeds using search params and login-loader

## 0.2.5

### Patch Changes

- 9b8bc9b: Fix maximum update depth exceeded error when logging out
  - Add missing `useEffect` dependencies

## 0.2.4

### Patch Changes

- a53ac74: Fix listening storage events
- aa6fa14: Add `useUserEvent` hook

## 0.2.3

### Patch Changes

- aca2cb0: Add `useLoginError` and `useLoginErrorMessage` hooks
- 569b9cf: Improve `<LoginForm>` and `<LogoutForm>` typings when `component` prop is used

## 0.2.2

### Patch Changes

- 362311f: Fixes an issue where Keycloak user does not always include the 'realm_access' property: "TypeError: Cannot read properties of undefined (reading 'roles')"

## 0.2.1

### Patch Changes

- ad078df: Enable SSR support

## 0.2.0

### Minor Changes

- 0cbf62b: - Add redirect login flow
  - Add silent logout flow
  - Move `redirect_uri` from form data to search params for app redirects and base value for `redirect_uri` / `post_logout_redirect_uri`

  Example:
  - Simulate external authentication flow (Suomi.fi)

### Patch Changes

- 8d65e4e: Add `<LoginLink>` and `<LoginRedirect>` components and `/login-loader` route for other then form action logins

## 0.1.0

### Minor Changes

- acaea45: Rename `@postinumero/react-router-oidc` to `@postinumero/react-router-oidc-client`

## 0.1.0

### Minor Changes

- 1188e2f: Add @postinumero/react-router-oidc-client
