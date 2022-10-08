import { Pattern, Token } from './pattern';

const mask = (text: string, pattern: Pattern): [string, string] => {
  let maskedText = '';
  let realText = '';

  const textArray = text.split('');

  let textIndex = 0;
  let maskIndex = 0;
  let lastMaskRegexIndex = 0;
  let currentMaskCount = 0;

  while (textIndex < textArray.length && maskIndex < pattern.length) {
    const currentMask: Token = pattern[maskIndex];
    let currentChar = '';

    if (typeof currentMask === 'string') {
      let currentMaskIndex = 0;
      const currentMaskArray = currentMask.split('');
      while (currentMaskIndex < currentMaskArray.length) {
        currentChar = textArray[textIndex];

        if (currentMaskArray[currentMaskIndex] === currentChar) {
          textIndex++;
          maskedText += currentMaskArray[currentMaskIndex];
        } else {
          break;
        }
        currentMaskIndex++;
        if (textIndex === textArray.length) {
          break;
        }
      }
      if (textIndex < textArray.length) {
        while (currentMaskIndex < currentMaskArray.length) {
          maskedText += currentMaskArray[currentMaskIndex];
          if (currentMaskArray[currentMaskIndex] === currentChar) {
            textIndex++;
          }
          currentMaskIndex++;
        }
      }
    } else {
      if (maskIndex !== lastMaskRegexIndex) {
        lastMaskRegexIndex = maskIndex;
        currentMaskCount = currentMask.count ?? 0;
      }
      const regex: RegExp = currentMask.regex;
      let count = 0;
      let matched = true;
      while (textIndex < textArray.length) {
        currentChar = textArray[textIndex];
        if (!regex.test(currentChar)) {
          matched = false;
          break;
        }
        maskedText += currentChar;
        realText += currentChar;
        count++;
        textIndex++;

        if (currentMask.count) {
          if (currentMaskCount >= 0 && currentMaskCount === count) {
            break;
          }
        } else if (currentMask.max && currentMask.min) {
          if (currentMask.max === count) {
            break;
          }
        }
      }
      if ((!matched && currentMask.min && count < currentMask.min) || (currentMask.count && count < currentMaskCount)) {
        textIndex++;
        maskIndex--;
        if (textIndex < textArray.length && currentMask.count) {
          currentMaskCount -= count;
        }
      }
    }
    maskIndex++;
  }

  return [maskedText, realText];
};

export default mask;
