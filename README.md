# untodo

Type-safe replacement for `// TODO:` comments.
Trackable in your IDE, enforceable by lint, surfaced by the type system.

> Status: **scaffold** — APIs are placeholders. See `Project Planning` in the repo for the design.

## Why

| Problem | Solution |
|---|---|
| `// TODO:` comments are easy to ignore | Function calls — lint can fail the build |
| Comments don't reach the type system | Returns `never` so callers detect it |
| No structure | Pass an object with `reason`, `issue`, etc. |
| Hard to track in an IDE | "Find references" works on a function |

Inspired by [Kotlin's `TODO()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-t-o-d-o.html).

## Install

```bash
npm install untodo
```

## Usage

```ts
import { TODO, FIXME, HACK, defineConfig } from "untodo";

function fetchUser(): User {
  return TODO({ reason: "未実装" });
}
```

`untodo.config.ts`:

```ts
import { defineConfig } from "untodo";

export default defineConfig({
  repo: "org/repo",
  onTodo: (meta) => console.warn(`TODO: ${meta.reason}`),
});
```

## ESLint plugin

```ts
// eslint.config.ts
import untodoPlugin from "untodo/eslint";

export default [
  {
    plugins: { untodo: untodoPlugin },
    rules: {
      "untodo/no-todo": "error",
      "untodo/no-fixme": "error",
      "untodo/no-hack": "warn",
    },
  },
];
```

The same plugin works with [oxlint](https://oxc.rs/docs/guide/usage/linter.html)'s JS plugin support.

## Scripts

```bash
npm run build          # unbuild
npm test               # vitest run
npm run test:coverage  # vitest run --coverage
npm run lint           # eslint .
npm run lint:fix       # eslint . --fix
```

## License

MIT
