import { describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import useMask from './use-mask';
import { Patterns } from '../mask/pattern';

vi.mock('../mask/pattern');

describe('useMask hook', () => {
  it('should create the pattern once', async () => {
    const pattern = await import('../mask/pattern');
    pattern.createPattern = vi.fn().mockResolvedValue([]);
    const { rerender } = renderHook(({ regex, patterns }) => useMask(regex, patterns), {
      initialProps: {
        regex: '',
        patterns: {},
      },
    });
    rerender({
      regex: '',
      patterns: {},
    });
    expect(pattern.createPattern).toHaveBeenCalledOnce();
  });

  it('should re create the pattern when regex is changed', async () => {
    const pattern = await import('../mask/pattern');
    pattern.createPattern = vi.fn().mockResolvedValue([]);
    const { rerender } = renderHook(({ regex, patterns }) => useMask(regex, patterns), {
      initialProps: {
        regex: '',
        patterns: {},
      },
    });
    rerender({
      regex: '-',
      patterns: {},
    });
    expect(pattern.createPattern).toHaveBeenCalledTimes(2);
  });

  it('should re create the pattern when patterns is changed', async () => {
    const pattern = await import('../mask/pattern');
    pattern.createPattern = vi.fn().mockResolvedValue([]);
    const patterns: Patterns = { '': /[0-9]/ };
    const { rerender } = renderHook(({ regex, patterns }) => useMask(regex, patterns), {
      initialProps: {
        regex: '',
        patterns,
      },
    });
    rerender({
      regex: '',
      patterns: {},
    });
    expect(pattern.createPattern).toHaveBeenCalledTimes(2);
  });
});
