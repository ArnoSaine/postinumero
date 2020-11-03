module.exports = function (api, opts) {
  const {
    pipelineOperator = { proposal: 'minimal' },
    privateMethods = { loose: true },
  } = opts;

  return {
    plugins: [
      // Adds syntax support for bind operator (::)
      require('@babel/plugin-proposal-function-bind').default,

      // Adds support for experimental features from stage 1
      require('@babel/plugin-proposal-export-default-from').default,
      require('@babel/plugin-proposal-logical-assignment-operators').default,
      [
        require('@babel/plugin-proposal-pipeline-operator').default,
        pipelineOperator,
      ],
      require('@babel/plugin-proposal-do-expressions').default,
      require('@babel/plugin-proposal-partial-application').default,

      // Adds support for experimental features from stage 2
      require('@babel/plugin-proposal-function-sent').default,
      require('@babel/plugin-proposal-throw-expressions').default,

      // Adds support for experimental features from stage 3
      require('@babel/plugin-syntax-import-meta').default,
      [
        require('@babel/plugin-proposal-private-methods').default,
        privateMethods,
      ],
    ],
  };
};
