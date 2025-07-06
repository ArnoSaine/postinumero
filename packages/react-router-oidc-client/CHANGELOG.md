# @postinumero/react-router-oidc-client

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
