# 会社イケピ 運用マニュアル

会社の設計・運用に関するドキュメント置き場。

## ファイル一覧

- [`tips-mcp-setup.md`](tips-mcp-setup.md) — Tips公式MCPをClaude Codeに接続する手順
- [`automation-24-365.md`](automation-24-365.md) — 24時間365日 自動で働かせる仕組みの作り方
- ルートの [`CLAUDE.md`](../../CLAUDE.md) — 会社の憲法(組織図・業務フロー・鉄の掟)
- [`.claude/agents/`](../../.claude/agents/) — 各部門(サブエージェント)の定義ファイル

## サブエージェントの使い方

Claude Codeでこのリポジトリを開くと、自動的に5部門が使える状態になる。

- 明示的に呼ぶ: 「researcherを使って、○○のテーマの市場調査をして」
- 自動で呼ばれる: 「新商品の企画を立てて」→ Claude Codeが適切な部門に自動委任

部門を増やす・直すには `.claude/agents/` にMarkdownファイルを追加・編集するだけ。

## 社内スキル(定型業務の手順書)

`.claude/skills/` 配下。チャットで `/スキル名` と打つか、自然な日本語で頼めば発動する。

- `new-product` — 新商品開発パイプライン(企画〜販売準備のフルサイクル。下書きまで)
- `tips-publish` — Tips公開ワークフロー(公開前チェック→下書き投稿。公開は社長承認後のみ)
- `weekly-report` — 週次売上レポート(毎週月曜のRoutineから呼ぶ想定)

## コンテンツの置き場所ルール

- `docs/content/research/` — リサーチ部の調査結果
- `docs/content/drafts/` — 制作部の下書き
- `docs/content/marketing/` — マーケ部のタイトル案・販売文・告知文
- `docs/content/reviews/` — 品質管理部のレビュー結果
- `docs/content/sales/` — 売上分析部のレポート
