# @postinumero/babel-preset-i18next

> Extract translation keys from the application and packages code.

## Usage

1. Project-wide Babel config is required in root directory, e.g. `babel.config.json`:

```json
{
  "babelrcRoots": ["./src", "./node_modules/some-package/**"], // Extract translations from these paths. Paths must also include this preset (see `.babelrc` below).
  "presets": ["@postinumero/i18next"]
}
```

2. `.babelrc.json` in `src` and packages:

```json
{
  "presets": ["@postinumero/i18next"]
}
```

## Options

Options (with some defaults) are passed to `babel-plugin-i18next-extract`:

```json
{
  "presets": [
    [
      "@postinumero/i18next",
      { "outputPath": "./public/extracted-keys/{{ns}}.json" }
    ]
  ]
}
```
