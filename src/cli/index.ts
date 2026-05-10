#!/usr/bin/env node
import { runInit } from './init';

const [, , command, ...rest] = process.argv;

if (command === 'init') {
  const force = rest.includes('--force') || rest.includes('-f');
  runInit({ force });
  process.exit(0);
}

console.log('Usage: untodo init [--force]');
process.exit(command ? 1 : 0);
