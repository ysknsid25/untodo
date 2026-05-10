import { createRule } from '../utils';

type Options = [];
type MessageIds = 'noHack';

export const noHack = createRule<Options, MessageIds>({
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
