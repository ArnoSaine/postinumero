// CommonJS format is used because babel-loader calls Babel synchronously.
module.exports = (api, ...other) => {
  const isCli = api.caller((caller) => caller?.name === '@babel/cli');
  const isJest = api.caller((caller) => caller?.name === 'babel-jest');

  if (isCli) {
    // Ignore tests from library builds.
    return {
      ignore: ['**/*.test.js'],
    };
  }

  if (isJest) {
    return {};
  }

  api.caller((caller) => {
    console.warn('Unknown caller', caller);
  });

  return {};
};
