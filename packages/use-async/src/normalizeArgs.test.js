import normalizeArgs from './normalizeArgs.js';

const f = normalizeArgs((func, config, args) => [func, config, args]);

test('normalize args', async () => {
  expect(f(f)).toEqual([f, {}, []]);
  expect(f(f, [1, 2, 3])).toEqual([f, {}, [1, 2, 3]]);
  expect(f(f, { a: 1 })).toEqual([f, { a: 1 }, []]);
  expect(f(f, undefined, [1, 2, 3])).toEqual([f, {}, [1, 2, 3]]);
  expect(f(f, { a: 1 }, [1, 2, 3])).toEqual([f, { a: 1 }, [1, 2, 3]]);
});
