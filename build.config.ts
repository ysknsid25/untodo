import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: [
    'src/index',
    'src/eslint',
    { input: 'src/cli', name: 'cli' },
  ],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
  externals: [
    'eslint',
    '@typescript-eslint/utils',
  ],
});
