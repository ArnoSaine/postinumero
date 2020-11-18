import options from './options';

test('this package', () => {
  expect(options(process.env)).toStrictEqual([['.js', 'mjs']]);
});

test('CommonJS', () => {
  expect(options({ npm_package_main: './lib/main.js' })).toStrictEqual([
    ['.js', 'cjs'],
  ]);
});

test('CommonJS without main', () => {
  expect(options({})).toStrictEqual([['.js', 'cjs']]);
});

test('CommonJS bin', () => {
  expect(options({ npm_package_bin: './lib/main.js' })).toStrictEqual([
    ['.js', 'cjs'],
  ]);
});

test('CommonJS named bin', () => {
  expect(options({ npm_package_bin_app: './lib/main.js' })).toStrictEqual([
    ['.js', 'cjs'],
  ]);
});

test('CommonJS with ES module bin', () => {
  expect(
    options({
      npm_package_main: './lib/main.js',
      npm_package_bin_app: './lib/main.mjs',
    })
  ).toStrictEqual([
    ['.js', 'cjs'],
    ['.mjs', 'mjs'],
  ]);
});

test('ES module', () => {
  expect(
    options({ npm_package_type: 'module', npm_package_main: './lib/main.js' })
  ).toStrictEqual([['.js', 'mjs']]);
});

test('ES module without main', () => {
  expect(options({ npm_package_type: 'module' })).toStrictEqual([
    ['.js', 'mjs'],
  ]);
});

test('ES module bin', () => {
  expect(
    options({ npm_package_type: 'module', npm_package_bin: './lib/main.js' })
  ).toStrictEqual([['.js', 'mjs']]);
});

test('ES module named bin', () => {
  expect(
    options({
      npm_package_type: 'module',
      npm_package_bin_app: './lib/main.js',
    })
  ).toStrictEqual([['.js', 'mjs']]);
});

test('CommonJS/ES module', () => {
  expect(
    options({
      npm_package_type: 'module',
      npm_package_main: './lib/main.cjs',
      npm_package_exports: './lib/main.js',
    })
  ).toStrictEqual([
    ['.cjs', 'cjs'],
    ['.js', 'mjs'],
  ]);
});

test('CommonJS/ES module with ES module bin', () => {
  expect(
    options({
      npm_package_type: 'module',
      npm_package_main: './lib/main.cjs',
      npm_package_exports: './lib/main.js',
      npm_package_bin_app: './lib/main.mjs',
    })
  ).toStrictEqual([
    ['.cjs', 'cjs'],
    ['.js', 'mjs'],
    ['.mjs', 'mjs'],
  ]);
});
