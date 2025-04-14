# @postinumero/react-router-oidc-client

A React Router integration for OpenID Connect (OIDC) authentication, built on top of [`oidc-client-ts`](https://www.npmjs.com/package/oidc-client-ts).

Provides hooks and utilities for managing authentication in a React Router application, including protected routes, user authentication state management, and automatic login redirects.

- 🔗 **Keycloak support with role-based access controls**
- 📌 **See the [example](/example) for a complete implementation**

## Setup

### 1. Configure Authentication in `root.tsx`

```tsx
import {
  loadOIDCRoot,
  useRemoveLogoutIntentSearchParam,
  useRevalidateUser,
} from "@postinumero/react-router-oidc-client";

// Load authentication state for the client
export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  return {
    ...(await loadOIDCRoot(args)),
  };
};

// App Layout with authentication revalidation
export function Layout({ children }: PropsWithChildren) {
  useRevalidateUser(); // Ensure user state is kept up to date

  return <>{children}</>;
}

// Root component
export default function App() {
  useRemoveLogoutIntentSearchParam(); // Clean up logout parameters from URL

  return <>{/* App content here */}</>;
}
```

### 2. Define Authentication Routes in `routes.ts`

Add authentication-related routes from the package.

```tsx
import auth from "@postinumero/react-router-oidc-client/routes";

export default [
  // Other application routes
  ...auth, // Includes login & logout handlers
];
```

### 3. Handle Unauthorized Access with an Error Boundary

To handle `401 Unauthorized` route errors, wrap `root.tsx`'s `ErrorBoundary` with `withHandleAuthErrorBoundary`.

```tsx
import {
  LoginForm,
  LoginRedirect,
  withHandleAuthErrorBoundary,
} from "@postinumero/react-router-oidc-client";
import { isRouteErrorResponse } from "react-router";

export const ErrorBoundary = withHandleAuthErrorBoundary(
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

## Keycloak Integration

In `root.tsx`:

```tsx
import {
  initKeycloak,
  loadOIDCRoot,
} from "@postinumero/react-router-oidc-client/keycloak";

initKeycloak({
  url: "https://example.com",
  realm: "example",
  client_id: "example-client",
});

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  return {
    ...(await loadOIDCRoot(args)),
  };
};
```

## Server Side Rendering

### 1. Add server and client `middleware`s, add `loader`, add `clientLoader.hydrate`

In `root.tsx`:

```ts
import {
  loadOIDCRoot,
  oidc_ssr_clientMiddleware,
  oidc_ssr_middleware,
} from "@postinumero/react-router-oidc-client";

export const unstable_middleware = [oidc_ssr_middleware];
export const unstable_clientMiddleware = [oidc_ssr_clientMiddleware];

export const loader = async (args: Route.LoaderArgs) => {
  return {
    ...(await loadOIDCRoot(args)),
  };
};

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  return {
    ...(await loadOIDCRoot(args)),
  };
};

// For redirect login flow
clientLoader.hydrate = true;
```

### 2. Protect routes in loaders and actions

```ts
import { authenticated } from "@postinumero/react-router-oidc-client";

export const loader = async (args: Route.LoaderArgs) => {
  await authenticated(args);

  return null;
};
```

## API Reference

### Authentication Hooks & Utilities

#### `getUser`

Retrieve the current authenticated user.

```tsx
import { getUser } from "@postinumero/react-router-oidc-client";

export const clientLoader = async () => {
  const user = await getUser();
  console.log(user?.access_token);
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

#### Protected Route

Ensure a route is only accessible when authenticated.

```tsx
import { authenticated } from "@postinumero/react-router-oidc-client";

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  const user = await authenticated(args);
  // ...
};
```

### Keycloak-Specific API

#### `getKeycloakUser`

Retrieve the current authenticated Keycloak user.

```tsx
import { getKeycloakUser } from "@postinumero/react-router-oidc-client/keycloak";

export const clientLoader = async () => {
  const user = await getKeycloakUser();
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

#### Keycloak Protected Route

Require specific roles for a protected route.

```tsx
import { authenticated } from "@postinumero/react-router-oidc-client/keycloak";

export const clientLoader = async (args: Route.ClientLoaderArgs) => {
  const user = await authenticated(args, {
    realmRoles: ["viewer"],
    resourceRoles: { "example-client": ["user", "editor"] },
  });
  // ...
};
```
