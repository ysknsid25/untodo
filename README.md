# untodo

<p align="center">
  <img src="docs/assets/img/logo-typing.gif" alt="untodo logo" />
</p>

[![JSR](https://jsr.io/badges/@ysknsid25/untodo)](https://jsr.io/@ysknsid25/untodo)
[![JSR Score](https://jsr.io/badges/@ysknsid25/untodo/score)](https://jsr.io/@ysknsid25/untodo/score)
[![npm version](https://img.shields.io/npm/v/untodo.svg)](https://www.npmjs.com/package/untodo)
[![npm downloads](https://img.shields.io/npm/dm/untodo.svg)](https://www.npmjs.com/package/untodo)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Test](https://github.com/ysknsid25/untodo/actions/workflows/test.yml/badge.svg)](https://github.com/ysknsid25/untodo/actions/workflows/test.yml)
[![Lint and Format](https://github.com/ysknsid25/untodo/actions/workflows/lint.yml/badge.svg)](https://github.com/ysknsid25/untodo/actions/workflows/lint.yml)

**English** | [日本語](./README-ja.md)

---

Type-safe TODO for humans and AI — trackable, structured, and lint-enforceable.

Type-safe replacement for `// TODO:` comments. Type-safe TODO for AI coding. AI agent TODO.
Trackable in your IDE, enforceable by lint, surfaced by the type system.

## Why

I think Leave the TODO in a way that makes it unpleasant. Not doing what needs to be done immediately is essentially a sign that you don't expect it to happen.

Therefore, such a situation must be resolved as quickly as possible. To achieve this, the tasks that need to be done must not be neatly integrated. There must always be a sense of unease.

| Problem | Solution |
|---|---|
| `// TODO:` comments are easy to ignore | Function calls — lint can fail the build |
| Comments don't reach the type system | Returns `never` so callers detect it |
| No structure | Pass an object with `reason`, `issue`, etc. |
| Hard to track in an IDE | "Find references" works on a function |

Inspired by [Kotlin's `TODO()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-t-o-d-o.html).

## Affinity with AI coding assistants

Now that AI-assisted coding is the norm, `// TODO:` comments have a new set of problems. **AI reads comments as plain text**, so it tends to miss the fact that a TODO exists, and the way TODOs are written drifts from author to author.

untodo addresses both issues.

### AI recognizes TODOs more reliably

A `TODO` in untodo is a function call backed by a type definition. AI coding assistants (Claude, GitHub Copilot, etc.) take type information and function signatures into account as context, so they pick up the existence and intent of a TODO far more reliably than from a `// TODO:` comment.

```typescript
// AI sees this only as "text"
// TODO: implement later (where? who? why?)

// AI sees this as "a call to an unimplemented function"
return TODO({ reason: "API not implemented yet", issue: 123, assignee: "alice" })
```

Structured metadata like `reason`, `issue`, and `assignee` lets AI accurately read off who left the TODO, why, and which issue it is tied to.

### TODOs become consistent in style

`// TODO:` comments tend to be written differently by every author.

```typescript
// TODO: fix this
// TODO(alice): fix later
// TODO #123
// FIXME: has a bug
```

With untodo, ESLint / oxlint rules can ban comment-style TODOs and enforce the function-call form. Consistent shape also improves AI completion and suggestion quality when it reads the surrounding code.

## Install

```bash
npm install untodo
```

## Quick start

Run the bundled initializer once at the project root:

```bash
npx untodo init
```

This writes two files (and prints an ESLint snippet you can paste into your existing config). Existing files are skipped unless you pass `--force`.

```
wrote: ./untodo.config.ts
wrote: ./global.d.ts
```

### 1. `untodo.config.ts` runtime configuration

Registers project-wide defaults via `defineConfig`. Per-call callbacks passed to `TODO()` / `FIXME()` / `HACK()` always win over what's set here, so this file is the right place to put fallback behavior.

The generated template ships with everything commented out:

```ts
import { defineConfig } from 'untodo';

export default defineConfig({
  // repo: 'org/repo',
  // onTodo:  (meta) => console.warn(`TODO: ${meta.reason}`),
  // onFixme: (meta) => console.error(`FIXME: ${meta.reason}`),
  // onHack:  (meta) => console.warn(`HACK: ${meta.reason}`),
});
```

| Field | Type | Purpose |
|---|---|---|
| `repo` | `string` | Repository in `org/repo` form. Tooling uses it to expand the `issue` meta field into a full URL (e.g. `https://github.com/org/repo/issues/123`). |
| `onTodo`  | `(meta: TodoMeta)  => void` | Default handler for every `TODO()` call that doesn't pass its own callback. |
| `onFixme` | `(meta: FixmeMeta) => void` | Default handler for every `FIXME()` call that doesn't pass its own callback. |
| `onHack`  | `(meta: HackMeta)  => void` | Default handler for every `HACK()` call that doesn't pass its own callback. |

A typical setup that warns in development and integrates with your logger:

```ts
import { defineConfig } from 'untodo';

export default defineConfig({
  repo: 'ysknsid25/untodo',
  onTodo: (meta) => {
    const issue = meta.issue ? ` (#${meta.issue})` : '';
    console.warn(`TODO${issue}: ${meta.reason}`);
  },
  onFixme: (meta) => console.error(`FIXME: ${meta.reason}`),
  onHack:  (meta) => console.warn(`HACK: ${meta.reason}`),
});
```

Import this file once from your application entry point (or test setup) so `defineConfig` runs before any `TODO()` is evaluated:

```ts
import './untodo.config';
```

### 2. `global.d.ts` extending the meta types

`TODO()`, `FIXME()`, and `HACK()` accept structured metadata. By default only `reason: string` is required. Add project-specific fields to the `TodoMeta` / `FixmeMeta` / `HackMeta` interfaces via TypeScript [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html).

The generated template:

```ts
declare module 'untodo' {
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
```

Uncomment or add fields to fit your team's workflow. For example:

```ts
declare module 'untodo' {
  interface TodoMeta {
    issue?: number | string;
    assignee?: string;
    severity?: 'low' | 'medium' | 'high';
  }
  interface FixmeMeta {
    issue?: number | string;
  }
  interface HackMeta {
    issue?: number | string;
  }
}

export {};
```

After this, callers get full type checking and IDE autocomplete for the extra fields:

```ts
return TODO({
  reason: 'wire up the user repository',
  issue: 123,           // ← typed
  assignee: 'alice',    // ← typed
  severity: 'high',     // ← typed, only 'low' | 'medium' | 'high' allowed
});
```

Make sure `global.d.ts` is included by your `tsconfig.json` (most default `"include"` patterns already pick up `**/*.d.ts`).

> The trailing `export {};` keeps the file as a module, which is required for `declare module` augmentation to apply.

### 3. Add the ESLint plugin

`init` finishes by printing a flat-config snippet. Paste it into your existing `eslint.config.ts` (or `.mjs`):

```ts
import untodoPlugin from 'untodo/eslint';

export default [
  {
    plugins: { untodo: untodoPlugin },
    rules: {
      'untodo/no-todo':  'error',
      'untodo/no-fixme': 'error',
      'untodo/no-hack':  'warn',
    },
  },
];
```

The same plugin works with [oxlint](https://oxc.rs/docs/guide/usage/linter.html)'s JS plugin support.

## Usage

```ts
import { TODO, FIXME, HACK } from 'untodo';

function fetchUser(): User {
  return TODO({ reason: 'wire up the user repository' });
}

function parseDate(input: string): Date {
  return FIXME({ reason: 'rejects valid ISO strings with offsets' });
}

function legacyAdapter(): Adapter {
  return HACK({ reason: 'old API ships in the next major; remove then' });
}
```

Because each function returns `never`, the surrounding code keeps type-checking as if a real value flowed through — there's no need to add `as User` casts or fake return values.

### Per-call handlers

Pass a callback as the second argument to override the global handler for one call:

```ts
return TODO(
  { reason: 'wire up the user repository' },
  (meta) => myLogger.warn('todo.hit', meta),
);
```

### Opting out of the global handler

Once `defineConfig({ onTodo })` is set, **every** `TODO()` call without a per-call callback fires the global handler. That's usually what you want — but on a hot path, or for a deliberately quiet placeholder, you may want one specific call to skip the handler.

`untodo` does not bake an opt-out flag into the meta types — naming and semantics are policy, and policy belongs to your team. The recommended pattern is to add a boolean field via Declaration Merging and short-circuit inside your handler:

```ts
// global.d.ts — pick whatever name your team prefers (silent / muted / skip ...)
declare module 'untodo' {
  interface TodoMeta {
    silent?: boolean;
  }
}

// untodo.config.ts
import { defineConfig } from 'untodo';

export default defineConfig({
  onTodo: (meta) => {
    if (meta.silent) return;
    sendToSentry(meta);
  },
});
```

```ts
// usage
TODO({ reason: 'normal placeholder' });                  // global fires
TODO({ reason: 'tight loop', silent: true });            // global skipped
TODO({ reason: 'custom path' }, (m) => myLogger.warn(m)); // per-call wins, global skipped
```

The same pattern applies to `FixmeMeta` / `HackMeta`. Keeping the gate inside the handler — rather than as a library-level switch — means the predicate can be as nuanced as you need (`if (meta.severity === 'low' && process.env.CI) return;` etc.) without `untodo` having to anticipate every shape.

## API

| Export | Description |
|---|---|
| `TODO(meta, cb?)` | Marks a code path as not yet implemented. Returns `never`. |
| `FIXME(meta, cb?)` | Marks broken code that must be repaired. Returns `never`. |
| `HACK(meta, cb?)` | Marks a deliberate workaround to revisit. Returns `never`. |
| `defineConfig(config)` | Registers project-wide defaults (used in `untodo.config.ts`). |
| `untodo/eslint` | ESLint / oxlint plugin exposing `no-todo`, `no-fixme`, `no-hack` rules. |

None of `TODO` / `FIXME` / `HACK` throw at runtime — they only invoke the configured handler. Lint enforcement is what makes them block the build.

## Bundle size

Trading `// TODO:` comments for function calls is not free. Comments are stripped by minification; function calls survive it, so every call site keeps roughly **30–60 bytes** in the shipped bundle (most of it is the metadata string itself). The library runtime is ~1.4 KB.

In practice this is rarely visible, because the recommended setup keeps these calls out of production in the first place:

- **ESLint blocks them in CI.** `untodo/no-todo` (and `no-fixme` / `no-hack`) set to `'error'` fails the build. A `TODO()` that reaches your production bundle is one that escaped review — fix it, don't ship it.
- **Runtime is minimal.** No `throw`, no reflection, no I/O — just an optional handler call.
- **Server / CLI bundles don't care.** A few hundred extra bytes in a Node process is noise.

### Zero-overhead opt-out for frontend bundles

If you want to be extra defensive about your shipped bundle, alias `untodo` to a no-op module in production builds and let the bundler tree-shake the runtime away:

```ts
// untodo-noop.ts
export const TODO = (): never => undefined as never;
export const FIXME = TODO;
export const HACK = TODO;
export const defineConfig = <T>(c: T) => c;
```

```ts
// vite.config.ts
import { defineConfig } from 'vite';
import path from 'node:path';

export default defineConfig(({ mode }) => ({
  resolve: {
    alias:
      mode === 'production'
        ? { untodo: path.resolve(__dirname, './untodo-noop.ts') }
        : {},
  },
}));
```

The same pattern works with Webpack (`resolve.alias`) and Rollup (`@rollup/plugin-alias`). Aliasing eliminates the runtime; pair it with terser's `pure_funcs: ['TODO', 'FIXME', 'HACK']` if you also want the metadata literals dropped where the call sites allow it.

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
