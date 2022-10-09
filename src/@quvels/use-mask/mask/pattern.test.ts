import { assert, describe, it } from 'vitest';
import { createPattern } from './pattern';

describe('mask pattern module', () => {
  it('should throw an error on invalid patterns', () => {
    assert.throw(() => createPattern('0{0'), 'Invalid pattern');
    assert.throw(() => createPattern('0{0}{0}'), 'Invalid pattern');
  });

  it('should return a mask pattern', () => {
    assert.deepEqual(createPattern('a'), ['a']);
    assert.deepEqual(createPattern('abc'), ['abc']);
    assert.deepEqual(createPattern('a\\\\bc'), ['a\\bc']);
    assert.deepEqual(createPattern('a\\bc'), ['abc']);
  });

  it('should return a phone mask pattern', () => {
    assert.deepEqual(createPattern('(###) ###-####', { '#': /[0-9]/ }), [
      '(',
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      ') ',
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      '-',
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
    ]);

    assert.deepEqual(createPattern('(#{3}) #{3}-#{4}', { '#': /[0-9]/ }), [
      '(',
      { regex: /[0-9]/, count: 3 },
      ') ',
      { regex: /[0-9]/, count: 3 },
      '-',
      { regex: /[0-9]/, count: 4 },
    ]);
  });

  it('should return a card number mask', () => {
    assert.deepEqual(createPattern('####-####-####-####', { '#': /[0-9]/ }), [
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      '-',
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      '-',
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      '-',
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
      { regex: /[0-9]/, count: 1 },
    ]);

    assert.deepEqual(createPattern('(#{3}) #{3}-#{4}', { '#': /[0-9]/ }), [
      '(',
      { regex: /[0-9]/, count: 3 },
      ') ',
      { regex: /[0-9]/, count: 3 },
      '-',
      { regex: /[0-9]/, count: 4 },
    ]);
  });

  it('should return a phone with country code mask pattern', () => {
    assert.deepEqual(createPattern('+#{1,3} (#{3}) #{3}-#{4}', { '#': /[0-9]/ }), [
      '+',
      { regex: /[0-9]/, min: 1, max: 3 },
      ' (',
      { regex: /[0-9]/, count: 3 },
      ') ',
      { regex: /[0-9]/, count: 3 },
      '-',
      { regex: /[0-9]/, count: 4 },
    ]);
  });

  it('should return a email mask pattern', () => {
    assert.deepEqual(createPattern('X*@X*.X*', { X: /[\w\-.]/ }), [
      { regex: /[\w\-.]/, count: -1 },
      '@',
      { regex: /[\w\-.]/, count: -1 },
      '.',
      { regex: /[\w\-.]/, count: -1 },
    ]);
  });
});
