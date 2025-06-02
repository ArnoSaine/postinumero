# @postinumero/react-router-oidc-client

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
