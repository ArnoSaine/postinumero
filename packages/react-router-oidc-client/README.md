# @postinumero/react-router-oidc-client

A React Router integration for OpenID Connect (OIDC) authentication, built on top of [`oidc-client-ts`](https://www.npmjs.com/package/oidc-client-ts).

Provides hooks and utilities for managing authentication in a React Router application, including protected routes, user authentication state management, and automatic login redirects.

- 🔗 **Keycloak support with role-based access controls**
- 📌 **See the [example](/example) for a complete implementation**

## Setup

### 1. Configure Authentication in `root.tsx`

```tsx
import {
  oidcSsrClientMiddleware, // oidcClientMiddleware in SPA mode
  oidcSsrMiddleware,
  useOidcProvider,
  withAuthErrorBoundary,
} from "@postinumero/react-router-oidc-client";
import { loader as loadOidcProvider } from "@postinumero/react-router-oidc-client/routes/provider.ssr"; // provider.spa in SPA mode

export const middleware: Route.MiddlewareFunction[] = [oidcSsrMiddleware];

export const clientMiddleware: Route.MiddlewareFunction[] = [
  oidcSsrClientMiddleware,
];

// Load authentication state
export const loader = async (args: Route.LoaderArgs) => {
  return {
    ...(await loadOidcProvider(args)),
  };
};

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  return args.serverLoader();
};

// For redirect login flow and HydrateFallback
clientLoader.hydrate = true;

// Root component
export default function App() {
  useOidcProvider();

  return <>{/* ... */}</>;
}
```

### 2. Define Authentication Routes in `routes.ts`

Add authentication-related routes from the package.

```tsx
import { authRoutes } from "@postinumero/react-router-oidc-client/routes";

export default [
  ...authRoutes, // Includes login & logout handlers
  // Other application routes
];
```

### 3. Update `vite.config.ts`

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ["@postinumero/react-router-oidc-client"],
  },
});
```

### 4. Handle Unauthorized Access with an Error Boundary

To handle `401 Unauthorized` route errors, wrap `root.tsx`'s `ErrorBoundary` with `withAuthErrorBoundary`.

```tsx
import {
  LoginForm,
  LoginRedirect,
  withAuthErrorBoundary,
} from "@postinumero/react-router-oidc-client";
import { isRouteErrorResponse } from "react-router";

export const ErrorBoundary = withAuthErrorBoundary(
  function UnauthorizedErrorBoundary(props) {
    // Redirect directly to external login flow with optional IDP hint:
    return (
      <LoginRedirect
        intent="redirect"
        {...{ "extraQueryParams.kc_idp_hint": "suomi-fi" }}
      />
    );

    // OR render a login form:
    return (
      <LoginForm>
        <input type="text" name="username" placeholder="Username" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        {isRouteErrorResponse(props.error) && props.error.data}
        <button>Login</button>
      </LoginForm>
    );

    // OR render a login link with optional IDP hint for external authentication:
    return (
      <LoginLink
        data={{
          intent: "redirect",
          "extraQueryParams.kc_idp_hint": "suomi-fi",
        }}
      >
        Login with Suomi.fi
      </LoginLink>
    );
  },
  function ErrorBoundary() {
    // Handle other errors
  },
);
```

### 5. Protect routes in loaders and actions

```ts
import { authenticated } from "@postinumero/react-router-oidc-client";

export const loader = async (args: Route.LoaderArgs) => {
  await authenticated(args);
  //...
};
```

## Keycloak Integration

In `root.tsx`:

```tsx
import { initKeycloak } from "@postinumero/react-router-oidc-client/keycloak";
import { loader as loadOidcProvider } from "@postinumero/react-router-oidc-client/keycloak/routes/provider.ssr"; // provider.spa in SPA mode

initKeycloak({
  url: "https://example.com",
  realm: "example",
  client_id: "example-client",
});

export const loader = async (args: Route.LoaderArgs) => {
  return {
    ...(await loadOidcProvider(args)),
  };
};
```

## API Reference

### Authentication Hooks & Utilities

#### `getUser`

Retrieve the current authenticated user.

```tsx
import { getUser } from "@postinumero/react-router-oidc-client";

const user = await getUser();
console.log(user?.access_token);
```

#### `loadUser`

Retrieve the current authenticated user.

```tsx
import { loadUser } from "@postinumero/react-router-oidc-client";

export const loader = (args: Route.LoaderArgs) => {
  const user = loadUser(args);
  // ...
};
```

#### `useUser`

Retrieve the current authenticated user.

```tsx
import { useUser } from "@postinumero/react-router-oidc-client";

function Component() {
  const user = useUser();
  // ...
}
```

#### `<LoginForm>`

```tsx
import { LoginForm } from "@postinumero/react-router-oidc-client";

function Component() {
  return (
    <LoginForm>
      <input type="text" name="username" placeholder="Username" required />
      <input type="password" name="password" placeholder="Password" required />
      <button>Login</button>
    </LoginForm>
  );
}
```

Create a login form to use redirect flow with an optional IDP hint:

```tsx
<LoginForm>
  <input type="hidden" name="extraQueryParams.kc_idp_hint" value="suomi-fi" />
  <button name="intent" value="redirect">
    Login with Suomi.fi
  </button>
</LoginForm>
```

#### `<LoginLink>`

Create a login link with optional IDP hint.

```tsx
import { LoginLink } from "@postinumero/react-router-oidc-client";

function Component() {
  return (
    <LoginLink
      data={{ intent: "redirect", "extraQueryParams.kc_idp_hint": "suomi-fi" }}
    >
      Login with Suomi.fi
    </LoginLink>
  );
}
```

#### `<LoginRedirect>`

Redirect directly to the external login flow with an optional IDP hint.

```tsx
import { LoginRedirect } from "@postinumero/react-router-oidc-client";

function Component() {
  return (
    <LoginRedirect
      intent="redirect"
      {...{ "extraQueryParams.kc_idp_hint": "suomi-fi" }}
    />
  );
}
```

#### `<LogoutForm>`

Handle user logout.

```tsx
import { LogoutForm } from "@postinumero/react-router-oidc-client";

function Component() {
  return (
    <LogoutForm>
      <button>Logout</button>
    </LogoutForm>
  );
}
```

Perform silent logout, stay on current page even if current route is protected:

```tsx
<LogoutForm redirect={location.href}>
  <button>Logout</button>
</LogoutForm>
```

Perform redirect logout, redirect to "/" if current route is protected:

```tsx
<LogoutForm>
  <button name="intent" value="redirect">
    Logout
  </button>
</LogoutForm>
```

Perform redirect logout, stay on current page even if current route is protected:

```tsx
<LogoutForm redirect={location.href}>
  <button name="intent" value="redirect">
    Logout
  </button>
</LogoutForm>
```

#### `useUserEvent`

Subscribe to [UserManager events](https://authts.github.io/oidc-client-ts/classes/UserManagerEvents.html).

```tsx
import { useUserEvent } from "@postinumero/react-router-oidc-client";

useUserEvent("unloaded", () => {
  console.log("You have been signed out.");
});
```

#### `useLoginError`

Access the raw login [error](https://authts.github.io/oidc-client-ts/classes/ErrorResponse.html) inside an error boundary (e.g., after a failed login redirect).

```tsx
import { useLoginError } from "@postinumero/react-router-oidc-client";

const loginError = useLoginError();

console.log(loginError?.error_description); // => "Invalid user credentials"
```

#### `useLoginErrorMessage`

Access a user-friendly, translated error message. Requires `react-intl`.

```tsx
import { useLoginErrorMessage } from "@postinumero/react-router-oidc-client";

const loginErrorMessage = useLoginErrorMessage();

console.log(loginErrorMessage); // => "Invalid username or password"
```

#### `<IsAuthenticated>`

Conditionally render content based on authentication state.

```tsx
import { IsAuthenticated } from "@postinumero/react-router-oidc-client";

function Component() {
  return (
    <IsAuthenticated fallback="Please log in">Welcome back!</IsAuthenticated>
  );
}
```

#### `useIsAuthenticated`

Check if a user is authenticated.

```tsx
import { useIsAuthenticated } from "@postinumero/react-router-oidc-client";

function Component() {
  const isAuthenticated = useIsAuthenticated();
  // ...
}
```

#### Protected Route (client & server)

Ensure a route is only accessible when authenticated.

```tsx
import { authenticated } from "@postinumero/react-router-oidc-client";

export const loader = async (args: Route.LoaderArgs) => {
  const user = await authenticated(args);
  // ...
};
```

### Keycloak-Specific API

#### `getKeycloakUser`

Retrieve the current authenticated Keycloak user.

```tsx
import { getKeycloakUser } from "@postinumero/react-router-oidc-client/keycloak";

const user = await getKeycloakUser();
```

#### `loadKeycloakUser`

Retrieve the current authenticated Keycloak user.

```tsx
import { loadKeycloakUser } from "@postinumero/react-router-oidc-client/keycloak";

export const loader = (args: Route.LoaderArgs) => {
  const user = loadKeycloakUser(args);
  // ...
};
```

#### `useKeycloakUser`

Retrieve the current authenticated Keycloak user.

```tsx
import { useKeycloakUser } from "@postinumero/react-router-oidc-client/keycloak";

function Component() {
  const user = useKeycloakUser();
  // ...
}
```

#### `<HasRole>`, `<HasRealmRole>`, `<HasResourceRole>`

Render UI conditionally based on user roles.

```tsx
import {
  HasRole,
  HasRealmRole,
  HasResourceRole,
} from "@postinumero/react-router-oidc-client/keycloak";

function Component() {
  return (
    <>
      <HasRole foo fallback={'User does not have role "foo"'} />
      <HasRole user viewer editor>
        User has roles "user", "editor", & "viewer"
      </HasRole>
      <HasRealmRole user viewer>
        User has realm roles "user" & "viewer"
      </HasRealmRole>
      <HasResourceRole example-client={["user", "editor"]}>
        User has "example-client" resource roles "user" & "editor"
      </HasResourceRole>
    </>
  );
}
```

#### `useHasRole`, `useHasRealmRole`, `useHasResourceRole`

```tsx
import {
  useHasRole,
  useHasRealmRole,
  useHasResourceRole,
} from "@postinumero/react-router-oidc-client/keycloak";

export default function Component() {
  const hasFoo = useHasRole({ foo: true });
  const canView = useHasRealmRole({ user: true, viewer: true });
  const canEdit = useHasResourceRole({
    "example-client": ["user", "editor"],
  });
}
```

#### Keycloak Protected Route (client & server)

Require specific roles for a protected route.

```tsx
import { authenticated } from "@postinumero/react-router-oidc-client/keycloak";

export const loader = async (args: Route.LoaderArgs) => {
  const user = await authenticated(args, {
    realmRoles: ["viewer"],
    resourceRoles: { "example-client": ["user", "editor"] },
  });
  // ...
};
```
