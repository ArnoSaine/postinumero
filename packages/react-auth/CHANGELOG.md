# @postinumero/react-auth

## 0.2.1

### Patch Changes

- 8d33465: Add missing dependency ajv

## 0.2.0

- **Breaking:** `useHasRole` takes `role: string | string[]`. Previously: `props: { role: string | string[] }`.
- **Breaking:** `useIsAllowed` takes `right: string | string[]`. Previously: `props: { right: string | string[] }`.
- **Breaking:** `useCurrentUser` returns `currentUser`. Previously: `[currentUser, setCurrentUser]`.
- Add `useSetCurrentUser`
- Add types
