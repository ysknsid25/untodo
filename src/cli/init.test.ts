import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { runInit } from './init';

function makeTmp(): string {
  return mkdtempSync(join(tmpdir(), 'untodo-init-'));
}

describe('runInit', () => {
  it('creates untodo.config.ts and global.d.ts in the target directory', () => {
    const cwd = makeTmp();
    runInit({ cwd, log: () => {} });
    expect(readFileSync(join(cwd, 'untodo.config.ts'), 'utf8')).toContain(
      'defineConfig',
    );
    expect(readFileSync(join(cwd, 'global.d.ts'), 'utf8')).toContain(
      'declare module',
    );
  });

  it('does not overwrite existing files unless force is set', () => {
    const cwd = makeTmp();
    writeFileSync(join(cwd, 'untodo.config.ts'), 'existing');
    runInit({ cwd, log: () => {} });
    expect(readFileSync(join(cwd, 'untodo.config.ts'), 'utf8')).toBe('existing');
  });

  it('overwrites with force', () => {
    const cwd = makeTmp();
    writeFileSync(join(cwd, 'untodo.config.ts'), 'existing');
    runInit({ cwd, log: () => {}, force: true });
    expect(readFileSync(join(cwd, 'untodo.config.ts'), 'utf8')).toContain(
      'defineConfig',
    );
  });
});
