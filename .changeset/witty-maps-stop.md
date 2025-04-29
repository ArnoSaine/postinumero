---
"@postinumero/unplugin-formatjs": patch
---

Fix injecting message IDs to JSX elements:

- Set `enforce: "pre"`

Also skip full AST transformation (by this plugin) by switching from SWC to Babel.
