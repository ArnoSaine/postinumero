module.exports = function (api, opts) {
  const {
    pipelineOperator = { proposal: 'minimal' },
    privateMethods = { loose: true },
  } = opts;

  return {
    plugins: [
      // Adds syntax support for bind operator (::)
      '@babel/plugin-proposal-function-bind',

      // Adds support for experimental features from stage 1
      '@babel/plugin-proposal-export-default-from',
      '@babel/plugin-proposal-logical-assignment-operators',
      ['@babel/plugin-proposal-pipeline-operator', pipelineOperator],
      '@babel/plugin-proposal-do-expressions',
      '@babel/plugin-proposal-partial-application',

      // Adds support for experimental features from stage 2
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-throw-expressions',

      // Adds support for experimental features from stage 3
      '@babel/plugin-syntax-import-meta',
      ['@babel/plugin-proposal-private-methods', privateMethods],
    ],
  };
};
