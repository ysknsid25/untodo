import { afterEach, describe, expect, it } from 'vitest';
import { defineConfig, getConfig, resetConfig } from './config';

afterEach(() => {
  resetConfig();
});

describe('defineConfig', () => {
  it('returns the same config object passed in', () => {
    const config = defineConfig({ repo: 'org/repo' });
    expect(config.repo).toBe('org/repo');
  });

  it('persists the config so getConfig can read it back', () => {
    defineConfig({ repo: 'a/b' });
    expect(getConfig().repo).toBe('a/b');
  });
});

describe('resetConfig', () => {
  it('clears the previously-set config', () => {
    defineConfig({ repo: 'a/b' });
    resetConfig();
    expect(getConfig()).toEqual({});
  });
});
