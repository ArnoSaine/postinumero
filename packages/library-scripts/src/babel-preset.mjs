import reactLibExperimental from '@postinumero/babel-preset-react-lib-experimental';
import transformRelativeFileExtensions from './babel-plugin-transform-relative-file-extensions.mjs';
import transformRuntimeFileExtensions from './babel-plugin-transform-runtime-file-extensions.mjs';

export default (api, { extension, useCommonJS }) => ({
  presets: [[reactLibExperimental, { useCommonJS }]],
  plugins: [
    [
      transformRelativeFileExtensions,
      { cjs: extension, js: extension, mjs: extension },
    ],
    transformRuntimeFileExtensions,
  ],
});
