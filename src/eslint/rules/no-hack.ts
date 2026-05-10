import { createRule } from '../utils';

type Options = [];
type MessageIds = 'noHack';

/**
 * `untodo/no-hack` — flags every call to the `HACK()` function exported by
 * `untodo`. Typically configured as a `warn` to nudge revisits without
 * blocking merges.
 */
export const noHack: ReturnType<typeof createRule<Options, MessageIds>>
  = createRule<Options, MessageIds>({
    name: 'no-hack',
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Warn on `HACK()` calls.',
      },
      schema: [],
      messages: {
        noHack: 'HACK call detected — please justify or remove.',
      },
    },
    defaultOptions: [],
    create(context) {
      return {
        CallExpression(node) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'HACK') {
            context.report({ node, messageId: 'noHack' });
          }
        },
      };
    },
  });
