# @postinumero/config

## 0.3.1

### Patch Changes

- 81c57e2: Update README.md

## 0.3.0

### Minor Changes

- 5836679: - Tell browser not to cache the config response. Set `cache: "no-store"` in the `fetch` options.
  - Change `ready()` promise to `ready` promise in ref and proxy formats
  - Use `import.meta.env` to locate runtime config. Remove biding to the `env` source.

## 0.2.1

### Patch Changes

- 097b5c5: Provide an export to modify the prefixes to be removed from environment variable names. Default `["VITE_"]`.

## 0.2.0

### Minor Changes

- 62bd645: Env config updates:

  - Remove `import.meta.env` usage
  - Add `init` function to receive environment variables

### Patch Changes

- c4e7ae1: Update README.md

## 0.1.0

### Minor Changes

- eea644e: Add @postinumero/config
