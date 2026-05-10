import type { FixmeMeta, HackMeta, TodoMeta } from './types';

/**
 * Project-wide configuration consumed by {@link TODO}, {@link FIXME}
 * and {@link HACK} when no per-call callback is supplied.
 *
 * Set this once from a setup file (e.g. `untodo.config.ts`) using
 * {@link defineConfig}.
 */
export interface UntodoConfig {
  /**
   * Repository in `org/repo` form. Used by tooling to expand the `issue`
   * meta field into a full URL (e.g. `https://github.com/org/repo/issues/123`).
   */
  repo?: string;
  /** Default handler invoked for {@link TODO} calls without a callback. */
  onTodo?: (meta: TodoMeta) => void;
  /** Default handler invoked for {@link FIXME} calls without a callback. */
  onFixme?: (meta: FixmeMeta) => void;
  /** Default handler invoked for {@link HACK} calls without a callback. */
  onHack?: (meta: HackMeta) => void;
}

let currentConfig: UntodoConfig = {};

/**
 * Register the project-wide untodo configuration and return it unchanged.
 *
 * Mirrors the `defineConfig` ergonomics used by Vite / Vitest. Per-call
 * callbacks passed to {@link TODO}, {@link FIXME} or {@link HACK} take
 * precedence over the handlers registered here.
 *
 * @param config The configuration object to register.
 * @returns The same `config` object, for chaining or assignment.
 */
export function defineConfig(config: UntodoConfig): UntodoConfig {
  currentConfig = config;
  return config;
}

/**
 * Read the currently-registered {@link UntodoConfig}.
 *
 * Returns an empty object if {@link defineConfig} has not been called
 * (or after {@link resetConfig}).
 */
export function getConfig(): UntodoConfig {
  return currentConfig;
}

/**
 * Clear the registered configuration. Primarily intended for tests.
 */
export function resetConfig(): void {
  currentConfig = {};
}
