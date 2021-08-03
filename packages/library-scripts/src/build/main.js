import spawn from 'cross-spawn';
import { fileURLToPath } from 'url';
import { dirname, extname, join, sep } from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import options from './options.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const outDirDefault = 'lib';

const npmBin = spawn.sync('npm', ['bin']).stdout.toString().trim();

// 'babel' command does not work, when developing other package and
// libary-scripts is linked locally (babel is not added to the target
// package's node_modules/.bin.). Use absolute path.
const babelBin = fs.existsSync(join(npmBin, 'babel'))
  ? 'babel'
  : __dirname
      .split(sep)
      .map((part, index, parts) => parts.slice(0, parts.length - index))
      .map((parts) => parts.join(sep))
      .map((parts) => join(parts, 'node_modules/.bin/babel'))
      .find((path) => fs.pathExistsSync(path));

const excludeArgs = ['--type'];

const createBuild =
  ({ args, commandArgs, NODE_ENV, outDir, srcDirs }) =>
  ({ outFileExtension, type }) => {
    const configFile = join(
      __dirname,
      `babel.config.${type}${outFileExtension === '.js' ? '-js' : ''}${extname(
        __filename
      )}`
    );

    const includedArgs = commandArgs.filter(
      (arg, index, array) =>
        !(excludeArgs.includes(arg) || excludeArgs.includes(array[index - 1]))
    );

    spawn(
      babelBin,
      [
        ...srcDirs,
        '--out-dir',
        outDir,
        '--out-file-extension',
        outFileExtension,
        '--config-file',
        configFile,
        '--copy-files',
        '--no-copy-ignored',
        ...args.split(' '),
        ...includedArgs,
      ],
      {
        stdio: 'inherit',
        env: {
          NODE_ENV,
          ...process.env,
        },
      }
    );
  };

export default ({ args, NODE_ENV }) =>
  (...commandArgs) => {
    const { argv } = yargs(commandArgs);
    const { outDir = outDirDefault, outFileExtension = '.js', type } = argv;
    const srcDirs = argv._.length ? argv._ : ['src'];

    const build = createBuild({
      args,
      commandArgs,
      NODE_ENV,
      outDir,
      srcDirs,
    });

    fs.removeSync(outDir);
    fs.ensureDirSync(outDir);

    if (type) {
      build({ outFileExtension, type });
    } else {
      for (const [outFileExtension, type] of options(
        fs.readJsonSync(process.env.npm_package_json)
      )) {
        build({ outFileExtension, type });
      }
    }
  };
