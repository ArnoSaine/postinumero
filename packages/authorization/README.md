# @postinumero/authorization

This package needs to be transpiled. Add this to Babel configuration:

```json
{
  "babelrcRoots": ["./node_modules/@postinumero/**"]
}
```

## API

### `withAuthorization(Component)`

Wrap the application with authorization context. `<Authenticated>`, `<Authorize>`, `useUser` and `useSetUser` are available in the wrapped component and children.

```js
import { withAuthorization } from '@postinumero/authorization';
// …
withAuthorization(App);
```

### `<Authenticated>`

Display the content only for authenticated users. Optionally render a fallback UI for public users.

**`fallback: element` (optional)**

```js
import { Authenticated } from '@postinumero/authorization';
// …
<Authenticated fallback={<Public />}>
  <Private />
</Authenticated>;
```

### `<Authorize>`

Display the content only for certain user roles. Optionally render a fallback UI for unauthorized users.

**`allow: string|string[]`**

**`fallback: element` (optional)**

```js
import { Authorize } from '@postinumero/authorization';
// …
<Authorize allow="admin" fallback={<Forbidden />}>
  <h1>Admin</h1>
</Authorize>;
```

### `useUser()`

Get user.

```js
import { useUser } from '@postinumero/authorization';

function UserInfo() {
  const user = useUser();
  <div>{user.name}</div>;
}
```

### `useSetUser(user)`

Set user.

```js
import { useSetUser } from '@postinumero/authorization';

function Login() {
  const setUser = useSetUser();
  return (
    <button
      onClick={() => {
        // Get user somehow
        const user = { id: '1', name: 'Admin', roles: ['admin'] };
        setUser(user);
      }}
    >
      Login
    </button>
  );
}
```

### `useAuthorize({ allow: string|string[] })`

Hook to detect if user has any of allowed roles. Internally used by `<Authorize>`.

```js
import { useAuthorize } from '@postinumero/authorization';
// …
const isAdmin = useAuthorize({ allow: 'admin' });
```
