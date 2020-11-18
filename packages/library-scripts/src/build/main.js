import spawn from 'cross-spawn';
import { fileURLToPath } from 'url';
import { dirname, extname, join } from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import options from './options.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const outDir = 'lib';

const npmBin = spawn.sync('npm', ['bin']).stdout.toString().trim();
const myBin = join(__dirname, '../../node_modules/.bin');

// 'babel' command does not work, when developing other package and
// libary-scripts is linked locally (babel is not added to the target
// package's node_modules/.bin.). Use absolute path.
const babelBin = fs.existsSync(join(npmBin, 'babel'))
  ? 'babel'
  : join(myBin, 'babel');

export default ({ NODE_ENV, args }) => (...commandArgs) => {
  const { argv } = yargs(commandArgs);
  const srcDirs = argv._.length ? argv._ : ['src'];
  const outDirArg = argv.outDir ?? outDir;
  fs.removeSync(outDirArg);
  fs.ensureDirSync(outDirArg);

  for (const [outFileExtension, type] of options(process.env)) {
    const configFile = join(
      __dirname,
      `babel.config.${type}${outFileExtension === '.js' ? '-js' : ''}${extname(
        __filename
      )}`
    );

    spawn(
      babelBin,
      [
        ...srcDirs,
        '--out-dir',
        outDirArg,
        '--out-file-extension',
        outFileExtension,
        '--config-file',
        configFile,
        '--copy-files',
        '--no-copy-ignored',
        ...args.split(' '),
        ...commandArgs,
      ],
      {
        stdio: 'inherit',
        env: {
          NODE_ENV,
          ...process.env,
        },
      }
    );
  }
};
