/**
 * untodo — type-safe replacement for `TODO`/`FIXME`/`HACK` comments.
 *
 * This is the main entry point. The ESLint / oxlint plugin lives at
 * `untodo/eslint`.
 *
 * @example
 * ```ts
 * import { TODO, defineConfig } from 'untodo';
 *
 * defineConfig({
 *   onTodo: (meta) => console.warn(`TODO: ${meta.reason}`),
 * });
 *
 * function fetchUser(): User {
 *   return TODO({ reason: 'unimplemented' });
 * }
 * ```
 *
 * @module
 */
export * from './core';
