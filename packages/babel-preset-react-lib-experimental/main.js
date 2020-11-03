module.exports = function (api, { useCommonJS, reactApp, ...opts }) {
  let {
    presets,
    plugins,
    ...preset
  } = require('@postinumero/babel-preset-react-app-experimental')(api, {
    reactApp: {
      absoluteRuntime: false,
      // This can be turned on when internal imports from
      // @babel\runtime\helpers\esm use file extensions.
      useESModules: false,
      ...reactApp,
    },
    ...opts,
  });

  if (useCommonJS) {
    presets = [
      ...presets,
      [
        '@babel/preset-env',
        {
          modules: 'commonjs',
        },
      ],
    ];

    // Removes support for adding React import declaration if file contains JSX
    // tags.
    plugins = plugins.filter((plugin) => plugin !== 'react-require');
  }

  return {
    presets,
    plugins,
    ...preset,
  };
};
