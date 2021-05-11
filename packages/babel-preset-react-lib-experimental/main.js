const { strict: assert } = require('assert');
const merge = require('merge-deep');

// If multiple versions of @babel/preset-env are installed, we must use the
// same as babel-preset-react-app uses.
const presetEnvs = [];
try {
  presetEnvs.push(
    require('babel-preset-react-app/node_modules/@babel/preset-env').default
  );
} catch {}
try {
  presetEnvs.push(require('@babel/preset-env').default);
} catch {}

module.exports = function (api, { env, reactApp, ...opts }) {
  const presetReactApp = require('babel-preset-react-app')(api, {
    // For @babel/plugin-transform-runtime. Use same Babel runtime as other
    // packages.
    absoluteRuntime: false,
    // For @babel/preset-react.
    runtime: 'automatic',
    // This can be turned on when internal imports from
    // @babel/runtime/helpers/esm use file extensions.
    useESModules: false,
    ...reactApp,
  });

  const presetReactAppPresetEnv = presetReactApp.presets.find(([preset]) =>
    presetEnvs.includes(preset)
  );

  assert(
    presetReactAppPresetEnv,
    'Find @babel/preset-env options of babel-preset-react-app'
  );

  const presetReactAppPresetEnvOptions = presetReactAppPresetEnv[1];

  Object.assign(presetReactAppPresetEnvOptions, env);

  return merge(
    require('@postinumero/babel-preset-experimental')(api, opts),
    presetReactApp
  );
};
