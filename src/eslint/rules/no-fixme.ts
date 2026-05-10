import { createRule } from '../utils';

type Options = [];
type MessageIds = 'noFixme';

/**
 * `untodo/no-fixme` — flags every call to the `FIXME()` function exported by
 * `untodo`. Intended to surface known defects that have escaped main.
 */
export const noFixme: ReturnType<typeof createRule<Options, MessageIds>>
  = createRule<Options, MessageIds>({
    name: 'no-fixme',
    meta: {
      type: 'problem',
      docs: {
        description: 'Disallow leftover `FIXME()` calls.',
      },
      schema: [],
      messages: {
        noFixme: 'Unresolved FIXME call.',
      },
    },
    defaultOptions: [],
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'FIXME') {
            context.report({ node, messageId: 'noFixme' });
          }
        },
      };
    },
  });
