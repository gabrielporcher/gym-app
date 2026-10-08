import { identity } from './example';

test('identity(2) === 2', () => {
  expect(identity(2)).toBe(2);
});

test('identity(0) === 0', () => {
  expect(identity(0)).toBe(0);
});
