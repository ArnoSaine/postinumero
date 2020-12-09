# @postinumero/library-scripts

## `init`

```sh
npx @postinumero/library-scripts init my-lib
```

### Type

By default, ES module package is initialized (type: `module`).

```sh
npx @postinumero/library-scripts init my-lib --type commonjs
```

## `build`

Target types and file extensions are detected using `type`, `main`, `exports` values in `package.json`. Additional arguments are passed to Babel.

```sh
library-scripts build
```

### Override defaults

```sh
library-scripts build --type mjs --out-dir lib/mjs
```

## `watch`

Watch build in development mode. Inline sourcemaps. Same arguments as in `build`.

```sh
library-scripts watch
```
