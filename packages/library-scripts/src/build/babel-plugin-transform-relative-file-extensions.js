function transform(specifier, rules) {
  if (specifier.value.startsWith('.')) {
    const ruleEntries = Object.entries(rules);
    const updateRuleEntries = ruleEntries.filter(([from, to]) => from !== to);
    for (const [from, to] of updateRuleEntries) {
      const originExtRegx = new RegExp(`\\.${from}$`);
      const value = specifier.value.replace(originExtRegx, `.${to}`);
      if (value !== specifier.value) {
        specifier.value = value;
        break;
      }
    }
  }
}

export default function babelPluginTransformRelativeFileExtensions() {
  return {
    name: 'transform-relative-file-extensions',
    visitor: {
      'ImportDeclaration|ExportNamedDeclaration|ExportAllDeclaration'(
        path,
        state
      ) {
        if (path.node.source) {
          transform(path.node.source, state.opts);
        }
      },
      CallExpression(path, state) {
        if (path.node.callee.name === 'require') {
          const [specifier] = path.node.arguments;
          if (specifier && specifier.type === 'StringLiteral') {
            transform(specifier, state.opts);
          }
        }
      },
    },
  };
}
