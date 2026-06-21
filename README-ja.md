# untodo

<p align="center">
  <img src="docs/assets/img/logo-typing.svg" alt="untodo logo" />
</p>

[![JSR](https://jsr.io/badges/@ysknsid25/untodo)](https://jsr.io/@ysknsid25/untodo)
[![JSR Score](https://jsr.io/badges/@ysknsid25/untodo/score)](https://jsr.io/@ysknsid25/untodo/score)
[![npm version](https://img.shields.io/npm/v/untodo.svg)](https://www.npmjs.com/package/untodo)
[![npm downloads](https://img.shields.io/npm/dm/untodo.svg)](https://www.npmjs.com/package/untodo)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![Test](https://github.com/ysknsid25/untodo/actions/workflows/test.yml/badge.svg)](https://github.com/ysknsid25/untodo/actions/workflows/test.yml)
[![Lint and Format](https://github.com/ysknsid25/untodo/actions/workflows/lint.yml/badge.svg)](https://github.com/ysknsid25/untodo/actions/workflows/lint.yml)

[English](./README.md) | **日本語**

---

Type-safe TODO for humans and AI - trackable, structured, and lint-enforceable.

`// TODO:` コメントを型安全に置き換えます。AI コーディングのための型安全な TODO。AI エージェントのための TODO。
IDE で追跡でき、lint で強制でき、型システムによって表に出てきます。

## Why

私は、TODO は「不快な形で残す」べきだと考えています。やるべきことをすぐにやらないというのは、なにかしらのすぐにできない事情があるからそうなっているます。しかし、その状態は期待値とはかけ離れた状態です。

したがって、そうした状況はできるだけ早く解消されなければなりません。そのためには、やるべきタスクがコードに綺麗に溶け込んでしまってはいけません。そこには常に違和感がなければならないのです。

| 問題 | 解決策 |
|---|---|
| `// TODO:` コメントは簡単に無視できる | 関数呼び出しにする。 lint がビルドを失敗/警告させる。 |
| コメントは型システムに届かない | `never` を返すので呼び出し側が検知できる |
| 構造がない | `reason`、`issue` などを持つオブジェクトを渡す |
| IDE での追跡が難しい | 関数なので「参照の検索」が効く |

[Kotlin の `TODO()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-t-o-d-o.html) に着想を得ています。

## AI コーディングアシスタントとの親和性

AI 支援によるコーディングが当たり前になった今、`// TODO:` コメントには新たな問題が生まれています。**AI はコメントをただのテキストとして読む**ため、TODO が存在することを見落としがちで、また TODO の書き方も著者ごとにバラついてしまいます。

untodo はこの両方の問題に対処します。

### AI が TODO をより確実に認識する

untodo の `TODO` は型定義に裏付けられた関数呼び出しです。AI コーディングアシスタント（Claude、GitHub Copilot など）は型情報と関数シグネチャをコンテキストとして考慮するため、`// TODO:` コメントよりもはるかに確実に TODO の存在と意図を拾います。

```typescript
// AI はこれを「テキスト」としてしか見ない
// TODO: implement later (where? who? why?)

// AI はこれを「未実装の関数への呼び出し」として見る
return TODO({ reason: "API not implemented yet", issue: 123, assignee: "alice" })
```

`reason`、`issue`、`assignee` といった構造化されたメタデータにより、AI は誰がなぜその TODO を残したのか、どの issue に紐づいているのかを正確に読み取れます。

### TODO のスタイルが統一される

`// TODO:` コメントは著者ごとに書き方がバラつきがちです。

```typescript
// TODO: fix this
// TODO(alice): fix later
// TODO #123
// FIXME: has a bug
```

untodo を使えば、ESLint / oxlint のルールでコメント形式の TODO を禁止し、関数呼び出し形式を強制できます。形が統一されることで、AI が周辺コードを読む際の補完・提案の品質も向上します。

## インストール

```bash
npm install untodo
```

## クイックスタート

プロジェクトのルートで、同梱の初期化コマンドを一度実行します:

```bash
npx untodo init
```

これにより 2 つのファイルが書き出されます（さらに既存の設定に貼り付けられる ESLint のスニペットが表示されます）。既存のファイルは `--force` を渡さない限りスキップされます。

```
wrote: ./untodo.config.ts
wrote: ./global.d.ts
```

### 1. `untodo.config.ts` ランタイム設定

`defineConfig` を介してプロジェクト全体のデフォルトを登録します。`TODO()` / `FIXME()` / `HACK()` に渡される呼び出しごとのコールバックは、ここで設定した内容より常に優先されます。そのため、このファイルはフォールバックの挙動を置く適切な場所です。

生成されるテンプレートは、すべてコメントアウトされた状態で配布されます:

```ts
import { defineConfig } from 'untodo';

export default defineConfig({
  // repo: 'org/repo',
  // onTodo:  (meta) => console.warn(`TODO: ${meta.reason}`),
  // onFixme: (meta) => console.error(`FIXME: ${meta.reason}`),
  // onHack:  (meta) => console.warn(`HACK: ${meta.reason}`),
});
```

| フィールド | 型 | 用途 |
|---|---|---|
| `repo` | `string` | `org/repo` 形式のリポジトリ。ツールはこれを使って `issue` メタフィールドを完全な URL に展開します（例: `https://github.com/org/repo/issues/123`）。 |
| `onTodo`  | `(meta: TodoMeta)  => void` | 独自のコールバックを渡さないすべての `TODO()` 呼び出しに対するデフォルトハンドラー。 |
| `onFixme` | `(meta: FixmeMeta) => void` | 独自のコールバックを渡さないすべての `FIXME()` 呼び出しに対するデフォルトハンドラー。 |
| `onHack`  | `(meta: HackMeta)  => void` | 独自のコールバックを渡さないすべての `HACK()` 呼び出しに対するデフォルトハンドラー。 |

開発時に警告を出し、ロガーと連携する典型的な設定:

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

`defineConfig` がどの `TODO()` の評価よりも先に実行されるよう、このファイルをアプリケーションのエントリーポイント（あるいはテストのセットアップ）から一度だけ import します:

```ts
import './untodo.config';
```

### 2. `global.d.ts` メタ型の拡張

`TODO()`、`FIXME()`、`HACK()` は構造化されたメタデータを受け取ります。デフォルトでは `reason: string` のみが必須です。TypeScript の [Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) を使って、`TodoMeta` / `FixmeMeta` / `HackMeta` インターフェースにプロジェクト固有のフィールドを追加できます。

生成されるテンプレート:

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

チームのワークフローに合わせてコメントを外したりフィールドを追加したりします。例えば:

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

これにより、呼び出し側は追加したフィールドに対する完全な型チェックと IDE の自動補完を得られます:

```ts
return TODO({
  reason: 'wire up the user repository',
  issue: 123,           // ← 型が付く
  assignee: 'alice',    // ← 型が付く
  severity: 'high',     // ← 型が付く。'low' | 'medium' | 'high' のみ許可
});
```

`global.d.ts` が `tsconfig.json` の対象に含まれていることを確認してください（多くのデフォルトの `"include"` パターンはすでに `**/*.d.ts` を拾います）。

> 末尾の `export {};` はこのファイルをモジュールとして保ち、`declare module` による型拡張が適用されるために必要です。

### 3. ESLint プラグインを追加する

`init` は最後に flat config 用のスニペットを出力します。それを既存の `eslint.config.ts`（または `.mjs`）に貼り付けます:

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

同じプラグインは [oxlint](https://oxc.rs/docs/guide/usage/linter.html) の JS プラグインサポートでも動作します。

## 使い方

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

各関数は `never` を返すため、周囲のコードは実際の値が流れているかのように型チェックが通り続けます。`as User` のキャストや偽の返り値を追加する必要はありません。

### 呼び出しごとのハンドラー

第 2 引数にコールバックを渡すと、その呼び出し 1 回だけグローバルハンドラーを上書きできます:

```ts
return TODO(
  { reason: 'wire up the user repository' },
  (meta) => myLogger.warn('todo.hit', meta),
);
```

### グローバルハンドラーをオプトアウトする

`defineConfig({ onTodo })` を設定すると、呼び出しごとのコールバックを持たない**すべての** `TODO()` 呼び出しがグローバルハンドラーを発火します。これはたいてい望ましい挙動ですが、ホットパス上や、意図的に静かなプレースホルダーでは、特定の 1 つの呼び出しだけハンドラーをスキップしたい場合があります。

`untodo` はオプトアウト用のフラグをメタ型に組み込んでいません。名前付けやセマンティクスはポリシーであり、ポリシーはチームに属するからです。推奨されるパターンは、Declaration Merging で boolean のフィールドを追加し、ハンドラー内でショートサーキットすることです:

```ts
// global.d.ts - チームの好みに合わせて名前を選ぶ (silent / muted / skip ...)
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
// 使い方
TODO({ reason: 'normal placeholder' });                  // グローバルが発火
TODO({ reason: 'tight loop', silent: true });            // グローバルがスキップされる
TODO({ reason: 'custom path' }, (m) => myLogger.warn(m)); // 呼び出しごとが優先され、グローバルはスキップ
```

同じパターンが `FixmeMeta` / `HackMeta` にも当てはまります。ゲートをライブラリレベルのスイッチではなくハンドラー内に置くことで、述語を必要なだけ細かく調整できます（`if (meta.severity === 'low' && process.env.CI) return;` など）。`untodo` があらゆる形を先回りして用意する必要はありません。

## API

| エクスポート | 説明 |
|---|---|
| `TODO(meta, cb?)` | 未実装のコードパスをマークする。`never` を返す。 |
| `FIXME(meta, cb?)` | 修正が必要な壊れたコードをマークする。`never` を返す。 |
| `HACK(meta, cb?)` | 後で見直すべき意図的な回避策をマークする。`never` を返す。 |
| `defineConfig(config)` | プロジェクト全体のデフォルトを登録する（`untodo.config.ts` で使用）。 |
| `untodo/eslint` | `no-todo`、`no-fixme`、`no-hack` ルールを公開する ESLint / oxlint プラグイン。 |

`TODO` / `FIXME` / `HACK` はいずれも実行時に throw しません。設定されたハンドラーを呼び出すだけです。ビルドをブロックするのは lint による強制です。

## バンドルサイズ

`// TODO:` コメントを関数呼び出しに置き換えるのはタダではありません。コメントは minify によって取り除かれますが、関数呼び出しは残るため、各呼び出し箇所はおおよそ **30〜60 バイト**を出荷バンドルに残します（その大部分はメタデータの文字列自体です）。ライブラリのランタイムは約 1.4 KB です。

ただし実際にはこれが目に見えることはまれです。推奨される設定では、そもそもこれらの呼び出しを本番から排除するからです:

- **ESLint が CI でブロックする。** `untodo/no-todo`（および `no-fixme` / `no-hack`）を `'error'` に設定すればビルドが失敗します。本番バンドルに到達した `TODO()` は、レビューをすり抜けたものです。出荷せず修正しましょう。
- **ランタイムは最小限。** `throw` も reflection も I/O もなく、任意のハンドラー呼び出しだけです。
- **サーバー / CLI のバンドルは気にしない。** Node プロセスでの数百バイトの増分はノイズです。

### フロントエンドバンドル向けのゼロオーバーヘッドなオプトアウト

出荷バンドルについてさらに念を入れたい場合は、本番ビルドで `untodo` を no-op モジュールにエイリアスし、バンドラーにランタイムを tree-shake させます:

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

同じパターンは Webpack（`resolve.alias`）や Rollup（`@rollup/plugin-alias`）でも動作します。エイリアスはランタイムを取り除きます。呼び出し箇所が許す範囲でメタデータのリテラルも落としたい場合は、terser の `pure_funcs: ['TODO', 'FIXME', 'HACK']` と組み合わせてください。

## スクリプト

```bash
npm run build          # unbuild
npm test               # vitest run
npm run test:coverage  # vitest run --coverage
npm run lint           # eslint .
npm run lint:fix       # eslint . --fix
```

## ライセンス

MIT
