import { defineConfig } from 'untodo';

export default defineConfig({
  onTodo: meta => console.warn(`TODO: ${meta.reason}`),
  onFixme: meta => console.error(`FIXME: ${meta.reason}`),
  onHack: meta => console.warn(`HACK: ${meta.reason}`),
});
