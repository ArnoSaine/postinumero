import callbackify from '@postinumero/callbackify-class';
import { merge } from 'lodash';
import PouchDBFind from 'pouchdb-find';

export default callbackify(
  class PouchDBBackend {
    static type = 'backend';

    init(services, backendOptions, _i18nextOptions) {
      this.services = services;
      this.options = {
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
        ...backendOptions,
      };

      this.options.db.constructor.plugin(PouchDBFind);
    }

    async read(...args) {
      const { db, selector, resourceBundle } = this.options;
      const {
        docs: [doc],
      } = await db.find({
        selector: selector(...args),
        length: 1,
      });

      return doc && resourceBundle(doc);
    }

    async readMulti(...args) {
      const { db, selectorMulti, resource } = this.options;
      const { docs } = await db.find({
        selector: selectorMulti(...args),
      });

      return merge(...docs.map(resource));
    }
  },
  ['read', 'readMulti']
);
