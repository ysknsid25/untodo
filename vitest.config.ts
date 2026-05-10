import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
      },
      exclude: [
        'examples/**',
        'playground/**',
        'dist/**',
        'build.config.ts',
        'vitest.config.ts',
        'eslint.config.mjs',
        'src/cli/**',
      ],
    },
  },
});
