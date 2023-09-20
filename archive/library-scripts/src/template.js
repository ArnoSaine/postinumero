import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import lodash from 'lodash';
import sortPackageJson from 'sort-package-json';
import { outDirDefault } from './build/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { argv } = yargs();

const type = argv.type ?? 'module';

const packageJson = fs.readJsonSync(join(__dirname, '..', 'package.json'));
const bin = lodash.last(packageJson.name.split('/'));

const jsEntry = `./${outDirDefault}/main.js`;
const cjsEntry = `./${outDirDefault}/main.cjs`;

export default (name) =>
  sortPackageJson({
    name,
    version: '0.1.0',
    type,
    exports:
      type === 'module'
        ? {
            import: jsEntry,
            require: cjsEntry,
          }
        : undefined,
    main:
      // If type is commonjs, only .js extension is used.
      type === 'commonjs' ? jsEntry : cjsEntry,
    files: [outDirDefault],
    scripts: {
      build: `${bin} build`,
      watch: `${bin} watch`,
    },
    dependencies: {
      '@babel/runtime': packageJson.dependencies['@babel/runtime'],
    },
    devDependencies: {
      [packageJson.name]: `^${packageJson.version}`,
    },
  });
