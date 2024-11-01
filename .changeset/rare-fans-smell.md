---
"@postinumero/config": minor
---

- Tell browser not to cache the config response. Set `cache: "no-store"` in the `fetch` options.
- Change `ready()` promise to `ready` promise in ref and proxy formats
- Use `import.meta.env` to locate runtime config. Remove biding to the `env` source.
