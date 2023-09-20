const path = require('path');
const findRoot = require('find-root');

function getProjectWideConfigOptions(api) {
  const preset = api
    .loadPartialConfig()
    .options.presets.find(({ file: { resolved } }) => resolved === __filename);

  return preset && preset.options;
}

module.exports = function (api, opts, configPath) {
  const rootPath = findRoot(configPath);
  const projectOpts = getProjectWideConfigOptions(api);

  if (!projectOpts) {
    return {};
  }

  if (rootPath === configPath) {
    // Do nothing on root level config. Otherwise i18next-extract goes
    // through node_modules and cause problems if minified code has `t`
    // variables.
    return {};
  }

  return {
    plugins: [
      [
        'i18next-extract',
        {
          discardOldKeys: true,
          // Default namespace is name of the nearest parent package (library or application)
          defaultNS: require(path.join(rootPath, 'package.json')).name,
          customUseTranslationHooks: [['@postinumero/i18next-helpers', 'useT']],
          ...projectOpts,
          ...opts,
        },
      ],
    ],
  };
};
