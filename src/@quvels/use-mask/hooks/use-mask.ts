import { useMemo } from 'react';
import mask from '../mask/mask';
import { createPattern, Patterns } from '../mask/pattern';

const useMask = (regex: string, patterns?: Patterns) => {
  const pattern = useMemo(() => createPattern(regex, patterns), [regex, patterns]);

  return (text: string) => mask(text, pattern);
};

export default useMask;
