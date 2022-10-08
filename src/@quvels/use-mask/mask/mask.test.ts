import { assert, describe, it } from 'vitest';
import mask from './mask';
import { createPattern } from './pattern';

describe('mask module', () => {
  it('should mask a phone number', () => {
    const phoneNumberMaskPattern = createPattern('(#{3}) #{3}-#{4}', {
      '#': /[0-9]/,
    });

    assert.deepEqual(mask('0000000000', phoneNumberMaskPattern), ['(000) 000-0000', '0000000000']);
    assert.deepEqual(mask('000000000', phoneNumberMaskPattern), ['(000) 000-000', '000000000']);
    assert.deepEqual(mask('(000)', phoneNumberMaskPattern), ['(000)', '000']);
    assert.deepEqual(mask('(000', phoneNumberMaskPattern), ['(000', '000']);
    assert.deepEqual(mask('(0000', phoneNumberMaskPattern), ['(000) 0', '0000']);
    assert.deepEqual(mask('(000 0', phoneNumberMaskPattern), ['(000) 0', '0000']);
    assert.deepEqual(mask('000', phoneNumberMaskPattern), ['(000', '000']);
    assert.deepEqual(mask('(', phoneNumberMaskPattern), ['(', '']);
    assert.deepEqual(mask('(000 ', phoneNumberMaskPattern), ['(000) ', '000']);
    assert.deepEqual(mask('000 000 0000', phoneNumberMaskPattern), ['(000) 000-0000', '0000000000']);
    assert.deepEqual(mask('000 000-0000', phoneNumberMaskPattern), ['(000) 000-0000', '0000000000']);
  });

  it('should mask a phone number with country code', () => {
    const phoneNumberMaskPattern = createPattern('+#{1,3} (#{3}) #{3}-#{4}', {
      '#': /[0-9]/,
    });
    assert.deepEqual(mask('0000000000000', phoneNumberMaskPattern), ['+000 (000) 000-0000', '0000000000000']);
    assert.deepEqual(mask('+0 000000000000', phoneNumberMaskPattern), ['+0 (000) 000-0000', '00000000000']);
    assert.deepEqual(mask('+ 000000000000', phoneNumberMaskPattern), ['+000 (000) 000-000', '000000000000']);
    assert.deepEqual(mask('+0 000', phoneNumberMaskPattern), ['+0 (000', '0000']);
  });

  it('should mask using * wildcard', () => {
    const emailMaskPattern = createPattern('X*-#*', {
      X: /[a-zA-Z]/,
      '#': /[0-9]/,
    });

    assert.deepEqual(mask('', emailMaskPattern), ['', '']);
    assert.deepEqual(mask('a', emailMaskPattern), ['a', 'a']);
    assert.deepEqual(mask('abc-', emailMaskPattern), ['abc-', 'abc']);
    assert.deepEqual(mask('abc-012', emailMaskPattern), ['abc-012', 'abc012']);
    assert.deepEqual(mask('abc012', emailMaskPattern), ['abc-012', 'abc012']);
  });

  it('should skip invalid characters', () => {
    let pattern = createPattern('(X|X)', {
      X: /[a-zA-Z0-9]/,
    });

    assert.deepEqual(mask('((000))', pattern), ['(0|0)', '00']);
    assert.deepEqual(mask('(0*******0)', pattern), ['(0|0)', '00']);
    assert.deepEqual(mask('(01*******0)', pattern), ['(0|1)', '01']);

    pattern = createPattern('(X{2}|X)', {
      X: /[a-zA-Z0-9]/,
    });

    assert.deepEqual(mask('(000)', pattern), ['(00|0)', '000']);
    assert.deepEqual(mask('(0*******0)', pattern), ['(00|', '00']);
    assert.deepEqual(mask('(01*******0)', pattern), ['(01|0)', '010']);

    pattern = createPattern('(X{1,3}|X)', {
      X: /[a-zA-Z0-9]/,
    });

    assert.deepEqual(mask('(000)', pattern), ['(000|', '000']);
    assert.deepEqual(mask('(0*******0)', pattern), ['(0|0)', '00']);
    assert.deepEqual(mask('(01*******0)', pattern), ['(01|0)', '010']);

    pattern = createPattern('(X*|X)', {
      X: /[a-zA-Z0-9]/,
    });

    assert.deepEqual(mask('(000)', pattern), ['(000|', '000']);
    assert.deepEqual(mask('(0*******0)', pattern), ['(0|0)', '00']);
    assert.deepEqual(mask('(01*******0)', pattern), ['(01|0)', '010']);

    pattern = createPattern('+#{1,3} (#{3}) #{3}-#{4}', {
      '#': /[0-9]/,
    });
    assert.deepEqual(mask('(0+52 (444) 205-3699)', pattern), ['+0 (524) 442-0536', '05244420536']);
  });
});
