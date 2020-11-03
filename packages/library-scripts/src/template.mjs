import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { argv } = yargs;

const type = argv.type ?? 'module';

export default {
  version: '0.1.0',
  homepage: '',
  license: 'ISC',
  author: '',
  files: ['lib'],
  type,
  main: type === 'commonjs' ? './lib/main.js' : './lib/main.cjs',
  exports:
    type === 'module'
      ? {
          import: './lib/main.js',
          require: './lib/main.cjs',
        }
      : undefined,
  repository: '',
  scripts: {
    build: 'library-scripts build',
    prepare: 'library-scripts prepare',
    watch: 'library-scripts watch',
  },
  devDependencies: {
    '@postinumero/library-scripts': `^${
      fs.readJsonSync(join(__dirname, '..', 'package.json')).version
    }`,
  },
};
