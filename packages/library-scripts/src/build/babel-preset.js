import reactLibExperimental from '@postinumero/babel-preset-react-lib-experimental';
import transformRelativeFileExtensions from './babel-plugin-transform-relative-file-extensions.js';

export default (api, { extension, useCommonJS }) => ({
  presets: [
    [
      reactLibExperimental,
      {
        // @babel/preset-env options.
        env: {
          modules: useCommonJS
            ? 'commonjs'
            : // Preserve ES modules.
              false,
        },
      },
    ],
  ],
  plugins: [
    [
      transformRelativeFileExtensions,
      { cjs: extension, js: extension, mjs: extension },
    ],
  ],
});
