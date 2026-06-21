# untodo LP

[untodo](https://github.com/ysknsid25/untodo) のランディングページです。
ビルドステップなし（素の HTML / CSS / JS）で完結しているため、GitHub Pages に
そのままデプロイできます。

## ローカルで確認する

```bash
# どちらでも構いません
python3 -m http.server 8000
# または
npx serve .
```

`http://localhost:8000` を開いてください。

## GitHub Pages へのデプロイ

このディレクトリ（`docs/`）は GitHub Actions 経由で自動デプロイされます。
ワークフローは [`.github/workflows/deploy-lp.yml`](../.github/workflows/deploy-lp.yml) です。

初回のみ、リポジトリ側で次の設定が必要です。

1. リポジトリの **Settings → Pages** を開く
2. **Build and deployment → Source** で「**GitHub Actions**」を選択する

以降は `master` ブランチの `docs/**` を変更して push するたびに、
`https://ysknsid25.github.io/untodo/` へ自動で公開されます。
手動で実行したい場合は **Actions → Deploy LP to GitHub Pages → Run workflow** を使ってください。

独自ドメインを使う場合は、このディレクトリに `CNAME` ファイルを追加し、
`assets/img` の OG 画像 URL（`index.html` の `og:image` / `og:url`）も合わせて更新してください。

## ディレクトリ構成

```
.
├── index.html              # ページ本体（data-i18n 属性で多言語化）
├── assets/
│   ├── css/style.css        # デザイントークン・レイアウト
│   ├── js/
│   │   ├── i18n.js          # 言語自動判定・切り替え
│   │   └── interactions.js  # prefers-reduced-motion 対応
│   ├── fonts/                # Mona Sans（ロゴ・見出し用）
│   ├── img/                  # ロゴ・OG画像
│   └── favicon/              # favicon 一式
└── i18n/
    ├── ja.json                # 日本語コンテンツ
    └── en.json                # 英語コンテンツ
```

## コンテンツを更新する

- 見出し・説明文などのテキストは `i18n/ja.json` / `i18n/en.json` を編集してください。
  コード上の固有名詞（`TODO()` など）は意図的に翻訳キーから外しています。
- 機能カードは `features.items` 配列の順番がそのまま表示順になります
  （`assets/js/i18n.js` の `renderFeatures` が DOM を生成します）。
- README 本体（[ysknsid25/untodo](https://github.com/ysknsid25/untodo)）の
  API テーブルやコード例を転記する場合は、転記元と日付をコメントで残し、
  README 更新時に手動で同期してください。

## ロゴ・favicon の再生成

`assets/img/logo.svg` と `assets/img/logo-typing.svg` は Mona Sans ExtraBold の
アウトラインをそのまま埋め込んだベクターで、フォントファイルへの依存なしに
描画されます。タイミングや文字を変更したい場合は SVG 内の `<path>` / `<set>` /
`<animate>` 要素を直接編集してください（CSS アニメーションではなく SVG ネイティブ
アニメーションで実装しているため、Chromium 系ブラウザでの再生が安定します）。
