import { defineConfig } from 'untodo';

export default defineConfig({
  repo: 'ysknsid25/untodo',
  onTodo: (meta) => {
    const issue = meta.issue ? ` (#${meta.issue})` : '';
    console.warn(`TODO${issue}: ${meta.reason}`);
  },
});
