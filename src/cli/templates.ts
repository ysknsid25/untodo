export const untodoConfigTemplate = `import { defineConfig } from 'untodo';

export default defineConfig({
  // repo: 'org/repo',
  // onTodo: (meta) => console.warn(\`TODO: \${meta.reason}\`),
  // onFixme: (meta) => console.error(\`FIXME: \${meta.reason}\`),
  // onHack: (meta) => console.warn(\`HACK: \${meta.reason}\`),
});
`;

export const globalDtsTemplate = `declare module 'untodo' {
  interface TodoMeta {
    // issue?: number | string;
    // assignee?: string;
  }
  interface FixmeMeta {
    // issue?: number | string;
  }
  interface HackMeta {
    // issue?: number | string;
  }
}

export {};
`;

export const eslintGuidance = `Add the plugin to your eslint.config.ts:

  import untodoPlugin from 'untodo/eslint';

  export default [
    {
      plugins: { untodo: untodoPlugin },
      rules: {
        'untodo/no-todo': 'error',
        'untodo/no-fixme': 'error',
        'untodo/no-hack': 'warn',
      },
    },
  ];
`;
