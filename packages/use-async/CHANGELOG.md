# 0.3.5

- Upgrade to `react-use@17.4.0`
- Include `src` files for source maps

# 0.3.4

- Add `createSSRCache` API. Fixes SSR not to cache responses between requests.

# 0.3.3

- Update SSR: return `nothing` from `map` to omit entry from SSR data
- Update package exports

# 0.3.2

- Update types

# 0.3.1

- Type fixes

# 0.3.0

- Rewrite in TypeScript
- Remove CommonJS support

# 0.2.0

- Add Server-side rendering
- Remove optional cache context
- `config` is no longer for `memoizee` but includes a cache id for SSR

# 0.1.8

- Add optional cache context
- Fix ES module usage

# 0.1.7

- Add missing dependency `react-use`

# 0.1.6

- Fix ES module usage

# 0.1.4

- Add types

# 0.1.3

- Fix switching components and rerendering
