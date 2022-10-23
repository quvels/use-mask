import { useMemo } from 'react';
import mask from '../mask/mask';
import { createPattern, Patterns } from '../mask/pattern';

const useMask = (regex: string, patterns: Patterns) => {
  const patternsCount = Object.keys(patterns).length;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const pattern = useMemo(() => createPattern(regex, patterns), [regex, patternsCount]);

  return (text: string) => mask(text, pattern);
};

export default useMask;
