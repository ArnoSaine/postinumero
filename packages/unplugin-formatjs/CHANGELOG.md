# @postinumero/unplugin-formatjs

## 0.1.6

### Patch Changes

- f6bf061: Fix generating message IDs in production when description is an object type
- Updated dependencies [6894a69]
  - @postinumero/formatjs-tools@0.1.4

## 0.1.5

### Patch Changes

- 882ce57: Pass options to `processMessages`
- b2e4be8: Add missing dependency `@babel/plugin-syntax-typescript`
- Updated dependencies [807a9e3]
  - @postinumero/formatjs-tools@0.1.3

## 0.1.4

### Patch Changes

- 88ff93c: Fix injecting message IDs to JSX elements:

  - Set `enforce: "pre"`

  Also skip full AST transformation (by this plugin) by switching from SWC to Babel.

## 0.1.3

### Patch Changes

- a438b6f: Add missing dependency `@swc/plugin-formatjs`
- bc62969: Set SWC `cacheRoot`
- Updated dependencies [a8f4031]
- Updated dependencies [bc62969]
  - @postinumero/formatjs-tools@0.1.2

## 0.1.2

### Patch Changes

- 0b55f51: Fix import

## 0.1.1

### Patch Changes

- c07d190: Publish
- Updated dependencies [c07d190]
  - @postinumero/formatjs-tools@0.1.1

## 0.1.0

### Minor Changes

- 111e65a: - Add @postinumero/formatjs-tools
  - Add @postinumero/unplugin-formatjs

### Patch Changes

- Updated dependencies [111e65a]
  - @postinumero/formatjs-tools@0.1.0
