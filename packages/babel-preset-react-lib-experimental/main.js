const merge = require('lodash/merge');

module.exports = function (api, { env, reactApp, ...opts }) {
  return merge(
    require('@postinumero/babel-preset-experimental')(api, opts),
    require('babel-preset-react-app')(api, {
      // For @babel/plugin-transform-runtime. Use same Babel runtime as other packages.
      absoluteRuntime: false,
      // For @babel/preset-react.
      runtime: 'automatic',
      // This can be turned on when internal imports from
      // @babel/runtime/helpers/esm use file extensions.
      useESModules: false,
      ...reactApp,
    }),
    {
      presets: [[require('@babel/preset-env').default, env]],
    }
  );
};
