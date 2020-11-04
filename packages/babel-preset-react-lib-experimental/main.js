const merge = require('merge-deep');
const presetEnv = require('@babel/preset-env').default;

module.exports = function (api, { env, reactApp, ...opts }) {
  const presetReactApp = require('babel-preset-react-app')(api, {
    // For @babel/plugin-transform-runtime. Use same Babel runtime as other packages.
    absoluteRuntime: false,
    // For @babel/preset-react.
    runtime: 'automatic',
    // This can be turned on when internal imports from
    // @babel/runtime/helpers/esm use file extensions.
    useESModules: false,
    ...reactApp,
  });

  const presetReactAppPresetEnvOptions = presetReactApp.presets.find(
    ([preset]) => preset === presetEnv
  )[1];

  Object.assign(presetReactAppPresetEnvOptions, env);

  return merge(
    require('@postinumero/babel-preset-experimental')(api, opts),
    presetReactApp
  );
};
