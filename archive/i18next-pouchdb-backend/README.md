# @postinumero/i18next-pouchdb-backend

This package needs to be transpiled. Add this to Babel configuration:

```json
{
  "babelrcRoots": ["./node_modules/@postinumero/**"]
}
```

## Example

```js
import i18next from 'i18next';
import PouchDB from 'pouchdb';
import PouchDBBackend from '@postinumero/i18next-pouchdb-backend';

i18next.use(PouchDBBackend).init({
  backend: {
    db: new PouchDB('i18n'),
  },
});
```

### With `i18next-multiload-backend-adapter`

```js
import i18next from 'i18next';
import PouchDB from 'pouchdb';
import BackendAdapter from 'i18next-multiload-backend-adapter';
import PouchDBBackend from '@postinumero/i18next-pouchdb-backend';

i18next.use(BackendAdapter).init({
  backend: {
    backend: PouchDBBackend,
    backendOption: {
      db: new PouchDB('i18n'),
    },
  },
});
```

## Default options

```js
const options = {
  selector: (language, namespace) => ({
    type: 'i18nResourceBundle',
    lng: language,
    ns: namespace,
  }),
  selectorMulti: (languages, namespaces) => ({
    type: 'i18nResourceBundle',
    lng: { $in: languages },
    ns: { $in: namespaces },
  }),
  resourceBundle: ({ bundle }) => bundle,
  resource: ({ lng, ns, bundle }) => ({ [lng]: { [ns]: bundle } }),
};
```
