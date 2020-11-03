import spawn from 'cross-spawn';
import { fileURLToPath } from 'url';
import { dirname, extname, join } from 'path';
import fs from 'fs-extra';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = 'src --out-dir lib --copy-files';

const build = {
  NODE_ENV: 'production',
  args: `${args} --source-maps`,
};

const scripts = {
  build,
  prepare: build,
  watch: {
    NODE_ENV: 'development',
    args: `${args} --source-maps inline --verbose --watch`,
  },
};

const packageJson = fs.readJsonSync(join(__dirname, '..', 'package.json'));

const ext = (path = '') => extname(path);

export default function (script, ...args) {
  const options = scripts[script];

  if (options) {
    const { NODE_ENV } = options;

    spawn.sync('rimraf', ['lib'], {
      stdio: 'inherit',
    });

    function babel(extension, type) {
      const configFile = join(
        __dirname,
        `babel.config.${type}${extension === '.js' ? '-js' : ''}${extname(
          __filename
        )}`
      );

      spawn(
        'babel',
        [
          '--out-file-extension',
          extension,
          '--config-file',
          configFile,
          ...options.args.split(' '),
          ...args,
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

    const mainExtension = ext(process.env.npm_package_main ?? packageJson.bin);
    const cjsExtension = ext(process.env.npm_package_exports_require);
    const mjsExtension = ext(
      process.env.npm_package_exports ?? process.env.npm_package_exports_import
    );

    if (
      mainExtension &&
      ![cjsExtension, mjsExtension].includes(mainExtension)
    ) {
      babel(
        mainExtension,
        process.env.npm_package_type === 'module' && !mjsExtension
          ? 'mjs'
          : 'cjs'
      );
    }

    if (cjsExtension) {
      babel(cjsExtension, 'cjs');
    }

    if (mjsExtension) {
      babel(mjsExtension, 'mjs');
    }
  } else {
    console.log(`Unknown script "${script}".`);
  }
}
