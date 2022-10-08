export type Patterns = {
  [token: string]: RegExp;
};

export type Pattern = Token[];

export type Token = string | RegexToken;

export interface RegexToken {
  regex: RegExp;
  count?: number;
  min?: number;
  max?: number;
}

const appendChar = (maskPattern: Pattern, char: string) => {
  if (maskPattern.length === 0) {
    maskPattern.push(char);
  } else {
    if (typeof maskPattern[maskPattern.length - 1] === 'string') {
      maskPattern[maskPattern.length - 1] += char;
    } else {
      maskPattern.push(char);
    }
  }
};

const createPattern = (regex: string, patterns?: Patterns) => {
  const patternRegex =
    /(?<token>(?<char>[^{}\\,])(?:{(?<count>[0-9]+)}|(?:{(?<min>[0-9]+),(?<max>[0-9]+)})|(?<infinity>\*))?|(?:\\(?<escaped>[a-z0-9{}\\,])))/gi;
  let match: RegExpExecArray | null = null;
  let patternMatchedLength = 0;

  const maskPatternResult: Pattern = [];
  while ((match = patternRegex.exec(regex)) !== null) {
    if (match.index === patternRegex.lastIndex) {
      patternRegex.lastIndex++;
    }

    const { token, char, count, escaped, infinity, min, max } = match.groups!;

    if (escaped !== undefined) {
      appendChar(maskPatternResult, escaped);
    }

    if (char !== undefined) {
      if (patterns !== undefined && patterns[char] !== undefined) {
        const t = {
          regex: patterns[char],
          ...(min === undefined &&
            max === undefined && {
              count: infinity !== undefined ? -1 : count !== undefined ? parseInt(count, 10) : 1,
            }),
          ...(min !== undefined && {
            min: parseInt(min, 10),
          }),
          ...(max !== undefined && {
            max: parseInt(max, 10),
          }),
        };
        maskPatternResult.push(t);
      } else {
        appendChar(maskPatternResult, char);
      }
    }

    patternMatchedLength += token.length;
  }
  if (patternMatchedLength !== regex.length) {
    throw new Error('Invalid pattern');
  }

  return maskPatternResult;
};

export { createPattern };
