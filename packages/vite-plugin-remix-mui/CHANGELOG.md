# @postinumero/vite-plugin-remix-mui

## 0.3.2

### Patch Changes

- 8c52f16: Update README.md: Include instructions for polyfilling `Promise.withResolvers` in Node.js versions below 22 (#19)
- Updated dependencies [5e1f3ad]
- Updated dependencies [8c52f16]
  - @postinumero/vite-plugin-module-proxy@0.2.1

## 0.3.1

### Patch Changes

- db62ccd: Fix `@mui/icons-material` imports. Use `@mui/icons-material/esm` alias only in versions below `6.1.0`.

## 0.3.0

### Minor Changes

- 8c1afcd: Imports from `@mui/material/*` are no longer proxied and do not have React Router integration. Update imports in the readme and example to `@mui/material`.

### Patch Changes

- Updated dependencies [8c1afcd]
  - @postinumero/vite-plugin-module-proxy@0.2.0

## 0.2.1

### Patch Changes

- 09ff9d1: - Support MUI v5 & v6
  - Fix hydration error: Use fixed version `@emotion/react@11.12.0`

## 0.2.0

### Minor Changes

- - Fix MUI icon imports
  - Change plugin interface from object to function
  - Internal changes

### Patch Changes

- Updated dependencies
  - @postinumero/vite-plugin-module-proxy@0.1.1

## 0.1.2

### Patch Changes

- bd9fb21:

  - Add @postinumero/vite-plugin-remix-resolve-config-path
  - Add @postinumero/vite-plugin-module-proxy
  - Update @postinumero/vite-plugin-remix-mui

- Updated dependencies [bd9fb21]
  - @postinumero/vite-plugin-module-proxy@0.1.0

## 0.1.1

### Patch Changes

- 105a131:
  - Add root route Layout export support
  - Fix watching root changes

## 0.1.0

### Minor Changes

- 38cee8c: Add @postinumero/vite-plugin-remix-mui
