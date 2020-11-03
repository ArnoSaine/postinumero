function transform(specifier) {
  if (
    specifier.value.startsWith('@babel/runtime/helpers/') &&
    !specifier.value.endsWith('.js')
  ) {
    specifier.value = `${specifier.value}.js`;
  } else if (specifier.value === '@babel/runtime/regenerator') {
    specifier.value = `${specifier.value}/index.js`;
  }
}

export default function babelPluginTransformRuntimeFileExtensions() {
  return {
    name: 'transform-runtime-file-extensions',
    visitor: {
      'ImportDeclaration|ExportNamedDeclaration'(path) {
        if (path.node.source) {
          transform(path.node.source);
        }
      },
      CallExpression(path) {
        if (path.node.callee.name === 'require') {
          const [specifier] = path.node.arguments;
          if (specifier && specifier.type === 'StringLiteral') {
            transform(specifier);
          }
        }
      },
    },
  };
}
