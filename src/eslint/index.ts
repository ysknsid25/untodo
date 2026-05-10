/**
 * untodo ESLint / oxlint plugin.
 *
 * Ships three rules that flag leftover `TODO()`, `FIXME()` and `HACK()`
 * calls from the `untodo` runtime. Compatible with ESLint v9 flat config
 * and oxlint's JS plugin support.
 *
 * @example ESLint flat config
 * ```ts
 * import untodoPlugin from 'untodo/eslint';
 *
 * export default [
 *     {
 *         plugins: { untodo: untodoPlugin },
 *         rules: {
 *             'untodo/no-todo': 'error',
 *             'untodo/no-fixme': 'error',
 *             'untodo/no-hack': 'warn',
 *         },
 *     },
 * ];
 * ```
 *
 * @module
 */
import { noTodo } from './rules/no-todo';
import { noFixme } from './rules/no-fixme';
import { noHack } from './rules/no-hack';

/**
 * Map of rule name → rule definition exposed by the plugin.
 */
export interface UntodoPluginRules {
  'no-todo': typeof noTodo;
  'no-fixme': typeof noFixme;
  'no-hack': typeof noHack;
}

/**
 * Single entry inside `configs.recommended` — an ESLint flat config block
 * containing only rule severities.
 */
export interface UntodoRecommendedConfig {
  rules: Record<string, 'off' | 'warn' | 'error'>;
}

/**
 * Shape of the default-exported plugin object.
 */
export interface UntodoPlugin {
  rules: UntodoPluginRules;
  configs: {
    recommended: UntodoRecommendedConfig[];
  };
}

const rules: UntodoPluginRules = {
  'no-todo': noTodo,
  'no-fixme': noFixme,
  'no-hack': noHack,
};

const configs: UntodoPlugin['configs'] = {
  recommended: [
    {
      rules: {
        'untodo/no-todo': 'warn',
        'untodo/no-fixme': 'warn',
        'untodo/no-hack': 'warn',
      },
    },
  ],
};

/**
 * The plugin object consumed by ESLint / oxlint.
 *
 * Register it under the `untodo` namespace so rule IDs resolve to
 * `untodo/no-todo`, `untodo/no-fixme`, `untodo/no-hack`.
 */
const untodoPlugin: UntodoPlugin = {
  rules,
  configs,
};

export default untodoPlugin;
