import { existsSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  eslintGuidance,
  globalDtsTemplate,
  untodoConfigTemplate,
} from './templates';

export interface InitOptions {
  cwd?: string;
  log?: (message: string) => void;
  /** Overwrite even when the file exists. */
  force?: boolean;
}

export function runInit(options: InitOptions = {}): void {
  const cwd = options.cwd ?? process.cwd();
  const log = options.log ?? console.log;

  writeIfMissing(
    resolve(cwd, 'untodo.config.ts'),
    untodoConfigTemplate,
    options.force,
    log,
  );
  writeIfMissing(
    resolve(cwd, 'global.d.ts'),
    globalDtsTemplate,
    options.force,
    log,
  );

  log('');
  log(eslintGuidance);
}

function writeIfMissing(
  path: string,
  content: string,
  force: boolean | undefined,
  log: (message: string) => void,
): void {
  if (!force && existsSync(path)) {
    log(`skip: ${path} (already exists)`);
    return;
  }
  writeFileSync(path, content, 'utf8');
  log(`wrote: ${path}`);
}
