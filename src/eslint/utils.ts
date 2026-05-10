import { ESLintUtils } from '@typescript-eslint/utils';

/**
 * Rule factory used by every untodo lint rule.
 *
 * Wraps `ESLintUtils.RuleCreator` so each rule's `meta.docs.url` resolves to
 * `https://github.com/ysknsid25/untodo/blob/main/docs/rules/<name>.md`.
 */
export const createRule: ReturnType<typeof ESLintUtils.RuleCreator>
  = ESLintUtils.RuleCreator(
    name => `https://github.com/ysknsid25/untodo/blob/main/docs/rules/${name}.md`,
  );
