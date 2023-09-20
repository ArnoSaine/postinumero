import preset from './babel-preset.js';

export default {
  presets: [[preset, { extension: 'cjs', useCommonJS: true }]],
};
