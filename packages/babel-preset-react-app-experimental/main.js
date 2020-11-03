module.exports = function (api, opts) {
  return {
    presets: [
      ['react-app', opts.reactApp],
      ['@postinumero/experimental', opts.experimental],
    ],
    plugins: [
      // Adds support for adding React import declaration if file contains JSX
      // tags.
      'react-require',
    ],
  };
};
