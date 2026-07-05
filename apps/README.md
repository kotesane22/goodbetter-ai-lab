# apps

AIツール・アプリ開発用のフォルダです。公開・実運用するアプリのソースコードを、
アプリごとにサブフォルダで管理します。

## 一覧

| アプリ | 説明 | 技術 |
| --- | --- | --- |
| [`diagnostic-tool/`](diagnostic-tool/) | 研修後 行動変容診断ツール（AI診断オプション対応） | Next.js 16 / React 19 / Tailwind 4 / Claude API |

### AI診断について（BYOK）
`diagnostic-tool` は静的サイト（GitHub Pages）として動きます。診断は既定でルールベースですが、
利用者が診断開始画面で自分の Anthropic API キーを入力すると、ブラウザから直接 Claude API を呼び出す
「AI診断」に切り替わります。キーはブラウザの localStorage にのみ保存され、Anthropic 以外には送信されません。
キー未入力時は従来どおりルールベースで診断します。

## 新しいアプリを追加するときの目安

1. `apps/<app-name>/` フォルダを作成する
2. アプリ直下に `README.md`（起動・ビルド手順）を置く
3. 公開する場合は `.github/workflows/` のデプロイ設定を更新する
