import preset from './babel-preset.mjs';

export default {
  presets: [[preset, { extension: 'cjs', useCommonJS: true }]],
};
