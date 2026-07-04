# goodbetter-ai-lab

AI を活用したツール制作・設計・発信を行うための個人ラボ（実験場）リポジトリです。
「良い（good）」を「より良く（better）」していくための試行錯誤をここに集約します。

## リポジトリ構成

```
goodbetter-ai-lab/
├── apps/                  AIツール・アプリ開発
│   └── diagnostic-tool/   研修後 行動変容診断ツール（Next.js）
├── docs/                  設計・戦略・メモ
│   └── content/           SNS・note・発信管理
└── .github/workflows/     CI / GitHub Pages への自動デプロイ
```

| フォルダ | 役割 |
| --- | --- |
| `apps/` | 公開・実運用するAIツールやアプリのソースコード |
| `docs/` | アイデア・設計図・プロンプト・戦略などの思考メモ |
| `docs/content/` | SNS・note などの発信ネタと運用管理 |

## 公開中のアプリ

### 研修後 行動変容診断ツール
企業研修後の「行動変容」の度合いを診断し、フィードバックを返す Web アプリです。
`main` ブランチへの push で GitHub Pages に自動デプロイされます。

- ソース: [`apps/diagnostic-tool/`](apps/diagnostic-tool/)
- 技術: Next.js 16 / React 19 / Tailwind CSS 4（静的エクスポート）

## 開発メモ

- 各アプリの開発手順は、それぞれの `apps/<app>/README.md` を参照してください。
- 設計・戦略に関するドキュメントは `docs/` にまとめます。
