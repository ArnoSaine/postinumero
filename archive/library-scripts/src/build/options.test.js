import fs from 'fs-extra';
import options from './options.js';

test('this package', () => {
  expect(options(fs.readJsonSync(process.env.npm_package_json))).toStrictEqual([
    ['.js', 'mjs'],
  ]);
});

test('CommonJS', () => {
  expect(options({ main: './lib/main.js' })).toStrictEqual([['.js', 'cjs']]);
});

test('CommonJS without extension', () => {
  expect(options({ main: 'lib' })).toStrictEqual([['.js', 'cjs']]);
});

test('CommonJS without main', () => {
  expect(options({})).toStrictEqual([['.js', 'cjs']]);
});

test('CommonJS bin', () => {
  expect(options({ bin: './lib/main.js' })).toStrictEqual([['.js', 'cjs']]);
});

test('CommonJS named bin', () => {
  expect(options({ bin: { app: './lib/main.js' } })).toStrictEqual([
    ['.js', 'cjs'],
  ]);
});

test('CommonJS with ES module bin', () => {
  expect(
    options({
      main: './lib/main.js',
      bin: { app: './lib/main.mjs' },
    })
  ).toStrictEqual([
    ['.js', 'cjs'],
    ['.mjs', 'mjs'],
  ]);
});

test('ES module', () => {
  expect(options({ type: 'module', main: './lib/main.js' })).toStrictEqual([
    ['.js', 'mjs'],
  ]);
});

test('ES module without main', () => {
  expect(options({ type: 'module' })).toStrictEqual([['.js', 'mjs']]);
});

test('ES module bin', () => {
  expect(options({ type: 'module', bin: './lib/main.js' })).toStrictEqual([
    ['.js', 'mjs'],
  ]);
});

test('ES module named bin', () => {
  expect(
    options({
      type: 'module',
      bin: { app: './lib/main.js' },
    })
  ).toStrictEqual([['.js', 'mjs']]);
});

test('CommonJS/ES module', () => {
  expect(
    options({
      type: 'module',
      main: './lib/main.cjs',
      exports: './lib/main.js',
    })
  ).toStrictEqual([
    ['.cjs', 'cjs'],
    ['.js', 'mjs'],
  ]);
});

test('CommonJS/ES module with ES module bin', () => {
  expect(
    options({
      type: 'module',
      main: './lib/main.cjs',
      exports: './lib/main.js',
      bin: { app: './lib/main.mjs' },
    })
  ).toStrictEqual([
    ['.cjs', 'cjs'],
    ['.js', 'mjs'],
    ['.mjs', 'mjs'],
  ]);
});
