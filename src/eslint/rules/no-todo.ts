import { createRule } from '../utils';

type Options = [];
type MessageIds = 'noTodo';

/**
 * `untodo/no-todo` - flags every call to the `TODO()` function exported by
 * `untodo`. Intended to fail CI once an unimplemented code path is in main.
 *
 * @example
 * ```ts
 * // Reported:
 * function fetchUser() { return TODO({ reason: 'unimplemented' }); }
 * ```
 */
export const noTodo: ReturnType<typeof createRule<Options, MessageIds>>
  = createRule<Options, MessageIds>({
    name: 'no-todo',
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow leftover `TODO()` calls.',
      },
      schema: [],
      messages: {
        noTodo: 'Unresolved TODO: {{reason}}',
      },
    },
    defaultOptions: [],
    create(context) {
      return {
        CallExpression(node) {
          if (
            node.callee.type !== 'Identifier'
            || node.callee.name !== 'TODO'
          ) {
            return;
          }
          const reason = extractReason(node.arguments[0]);
          context.report({
            node,
            messageId: 'noTodo',
            data: { reason: reason ?? '(no reason)' },
          });
        },
      };
    },
  });

function extractReason(arg: unknown): string | undefined {
  if (
    typeof arg !== 'object'
    || arg === null
    || (arg as { type?: string }).type !== 'ObjectExpression'
  ) {
    return undefined;
  }
  const props = (arg as { properties: Array<unknown> }).properties;
  for (const prop of props) {
    const p = prop as {
      type: string;
      key?: { type: string; name?: string; value?: string };
      value?: { type: string; value?: unknown };
    };
    if (p.type !== 'Property') continue;
    const keyName
      = p.key?.type === 'Identifier'
        ? p.key.name
        : p.key?.type === 'Literal'
          ? String(p.key.value)
          : undefined;
    if (keyName === 'reason' && p.value?.type === 'Literal') {
      return String(p.value.value);
    }
  }
  return undefined;
}
