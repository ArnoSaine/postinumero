---
"@postinumero/vite-plugin-module-proxy": minor
---

- Rename options:
  - ~~`id`~~ --> `target`
  - ~~`proxy`~~ --> `handler`
  - ~~`url`~~ --> `base`
- Fix issue with chained plugins
- Performance improvements
- Re-exports: If a default export is found in the target module, it is re-exported
