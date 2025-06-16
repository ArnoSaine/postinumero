# @postinumero/react-router-formatjs

## 0.2.4

### Patch Changes

- d851fb7: - Fix error: Dynamic access of "import.meta.env" is not supported
  - Organize modules to avoid cyclic imports

## 0.2.3

### Patch Changes

- 00301cf: - **Deprecate** named export `intlRoutes`. Use the default export from `@postinumero/react-router-formatjs/routes` instead.
  - Fix production build error caused by missing messages

## 0.2.2

### Patch Changes

- 261b26f: Fix using base environment and locales in production. Fallback to base environment and locales when no environment is requested or requested environment is not available.
- f87af41: Add `@postinumero/formatjs-helpers`

## 0.2.1

### Patch Changes

- 142049d: Fix: Prevent duplicate instances of client context

## 0.2.0

### Minor Changes

- 9813253: Remove default `ES2022` target for `build` and `optimizeDeps`

### Patch Changes

- 20df03a: Fallback to the default messages when no messages are found
- 918cc45: Import `DEFAULT_INTL_CONFIG` from `@formatjs/intl` instead of the unofficial and incompatible export from `react-intl/src/utils.js`
- Updated dependencies [0df275f]
- Updated dependencies [c08310f]
  - @postinumero/formatjs-tools@0.1.6
  - @postinumero/unplugin-formatjs@0.1.7

## 0.1.4

### Patch Changes

- 33b86e7: Fix initial build when `.lang` directory is not created

## 0.1.3

### Patch Changes

- 8ef7f53: Export `<LocaleDisplayName>`
- 17ca910: Fix development build
- a9eef62: Add typings to mark `MessageDescriptor` `id` as non-optional
- 1a9eb69: Fix typing `withLayoutIntlProvider` `Layout` param

## 0.1.2

### Patch Changes

- 4cbdc92: Add missing types for '/app/root' and '/react-router.config.ts'
- d3caf42: Fix Node.js compatibility:

  - Use optional `import.meta.env` and `import.meta.glob`
  - Move `/react-router.config.ts` imports to a utility

- Updated dependencies [a21ff06]
  - @postinumero/formatjs-tools@0.1.5

## 0.1.1

### Patch Changes

- e8a8c1e: - Add configurable locale and environment strategies
  - Add locale and environment selectors
- Updated dependencies [6894a69]
  - @postinumero/formatjs-tools@0.1.4

## 0.1.0

### Minor Changes

- c4c0d03: Add `@postinumero/react-router-formatjs`
