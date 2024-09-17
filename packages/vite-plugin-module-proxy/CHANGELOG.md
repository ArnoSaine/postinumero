# @postinumero/vite-plugin-module-proxy

## 0.2.0

### Minor Changes

- 8c1afcd: - Rename options:
  - ~~`id`~~ --> `target`
  - ~~`proxy`~~ --> `handler`
  - ~~`url`~~ --> `base`
  - Fix issue with chained plugins
  - Performance improvements
  - Re-exports: If a default export is found in the target module, it is re-exported

### Patch Changes

- Updated dependencies [176b7c3]
  - @postinumero/vite-plugin-remix-resolve-config-path@0.1.2

## 0.1.2

### Patch Changes

- 811d60e: Update `proxy` option to accept `string` or `Promise<string>`

## 0.1.1

### Patch Changes

- Rename @postinumero/vite-plugin-replace-module to @postinumero/vite-plugin-module-proxy
- Updated dependencies
  - @postinumero/vite-plugin-remix-resolve-config-path@0.1.1

## 0.1.0

### Minor Changes

- bd9fb21: Add @postinumero/vite-plugin-module-proxy

### Patch Changes

- Updated dependencies [bd9fb21]
  - @postinumero/vite-plugin-remix-resolve-config-path@0.1.0
