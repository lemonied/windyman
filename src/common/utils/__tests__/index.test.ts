import { deepMerge } from '../index';

test('deepMerge array', () => {
  const o = deepMerge(
    [{a: 1, b: 2}, 3, {c: { d: 4 }}],
    [{a: { d: 4 }}, [], {c: { f: 6 }}]);
  expect(o[0].a.d).toBe(4);
  expect(o[1]).toStrictEqual([]);
  expect(o).toEqual([{a: { d: 4 }, b: 2}, [], {c: { d: 4, f: 6 }}]);
});
