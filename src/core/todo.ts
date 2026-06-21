import { getConfig } from './config';
import type { FixmeMeta, HackMeta, TodoMeta } from './types';

/**
 * Marks a code path as not yet implemented.
 *
 * Returns `never`, so callers continue to type-check as if the value flowed
 * through. Does **not** throw - runtime behaviour is delegated to the
 * supplied callback (or the global `onTodo` from {@link defineConfig}).
 *
 * Lint enforcement is the responsibility of the `untodo/no-todo` ESLint /
 * oxlint rule shipped from `untodo/eslint`.
 *
 * @example
 * ```ts
 * function fetchUser(): User {
 *   return TODO({ reason: 'wire up the user repository' });
 * }
 * ```
 *
 * @param meta Structured description of the unimplemented work.
 * @param cb Optional per-call handler; overrides the global `onTodo`.
 * @returns Never - the function returns `undefined` typed as `never`.
 */
export function TODO(meta: TodoMeta, cb?: (meta: TodoMeta) => void): never {
  const handler = cb ?? getConfig().onTodo;
  handler?.(meta);
  return undefined as never;
}

/**
 * Marks code that is known to be broken and must be repaired.
 *
 * Same semantics as {@link TODO}: returns `never`, never throws, and
 * runtime behaviour is delegated to the supplied callback (or the global
 * `onFixme` from {@link defineConfig}).
 *
 * @param meta Structured description of the defect.
 * @param cb Optional per-call handler; overrides the global `onFixme`.
 * @returns Never - the function returns `undefined` typed as `never`.
 */
export function FIXME(meta: FixmeMeta, cb?: (meta: FixmeMeta) => void): never {
  const handler = cb ?? getConfig().onFixme;
  handler?.(meta);
  return undefined as never;
}

/**
 * Marks a deliberate workaround that should be revisited.
 *
 * Same semantics as {@link TODO}: returns `never`, never throws, and
 * runtime behaviour is delegated to the supplied callback (or the global
 * `onHack` from {@link defineConfig}).
 *
 * @param meta Structured description of the workaround.
 * @param cb Optional per-call handler; overrides the global `onHack`.
 * @returns Never - the function returns `undefined` typed as `never`.
 */
export function HACK(meta: HackMeta, cb?: (meta: HackMeta) => void): never {
  const handler = cb ?? getConfig().onHack;
  handler?.(meta);
  return undefined as never;
}
