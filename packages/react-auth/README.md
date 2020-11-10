# @postinumero/react-auth

User roles and rights based rendering.

## API

### `<Auth>`

Wraps components with the auth context. Other components and hooks are available in the children.

```js
import { Auth } from '@postinumero/react-auth';

function App() {
  return <Auth>…</Auth>;
}
```

### `withAuth(Component)`

Wraps the application with the auth context. Other components and hooks are available in the wrapped component and in the children.

```js
import { withAuth } from '@postinumero/react-auth';

function App() {
  // …
}

withAuth(App);
```

### `<IsAuthenticated>`

Renders the content only for authenticated users. Optionally renders a fallback UI for non-authenticated users.

**`fallback: element` (optional)**

```js
import { IsAuthenticated } from '@postinumero/react-auth';
// …
<IsAuthenticated fallback={<LoggedOut />}>
  <LoggedIn />
</IsAuthenticated>;
```

### `<HasRole>`

Renders the content only for users with the given roles. Optionally renders a fallback UI for other users.

**`role: string|string[]`**

**`fallback: element` (optional)**

```js
import { HasRole } from '@postinumero/react-auth';
// …
<HasRole role="admin" fallback={<Forbidden />}>
  <AdminPanel />
</HasRole>;
```

### `<IsAllowed>`

Renders the content only for users with the given rights. Optionally renders a fallback UI for other users.

**`right: string|string[]`**

**`fallback: element` (optional)**

```js
import { IsAllowed } from '@postinumero/react-auth';
// …
<IsAllowed right="admin" fallback={<Forbidden />}>
  <AdminPanel />
</IsAllowed>;
```

### `useCurrentUser()`

Get and set the current user. User may have optional properties `roles: string[]` and `rights: string[]`.

```js
import { useCurrentUser } from '@postinumero/react-auth';

function Login() {
  const [, setCurrentUser] = useCurrentUser();
  return (
    <button
      onClick={async () => {
        // Get user
        const user = await login(/*…*/);
        // And
        setCurrentUser(user);
      }}
    >
      Login
    </button>
  );
}

function UserInfo() {
  const [currentUser] = useCurrentUser();
  <div>{currentUser.name}</div>;
}
```

### `useIsAuthenticated()`

Hook to detect if user is logged in.

```js
import { useIsAuthenticated } from '@postinumero/react-auth';
// …
const isAuthenticated = useIsAuthenticated();
```

### `useHasRole({ role: string|string[] })`

Hook to detect if user has any of allowed roles.

```js
import { useHasRole } from '@postinumero/react-auth';
// …
const isAdmin = useHasRole({ role: 'admin' });
```

### `useIsAllowed({ right: string|string[] })`

Hook to detect if user has any of allowed rights.

```js
import { useIsAllowed } from '@postinumero/react-auth';
// …
const isAllowedEdit = useIsAllowed({ right: 'edit' });
```
