# Tips公式MCP(TipsMCP)接続手順

Tipsは公式にMCP対応しており、Claude(Claude.ai / Claude Desktop / Claude Code)から
**記事の作成・編集・公開・売上確認**が日本語の会話だけでできる。
2026年6月末のアップデートで全エディタ形式に対応済み。

- 公式お知らせ: https://tips.jp/u/tipsinfo/a/kLTRjyN2 (「【新機能】Tips MCP対応」)

## 接続手順(いずれか1つでOK)

**TipsのMCPサーバーURL(確認済み・2026-07-22): `https://tips.jp/mcp`**

### A. claude.ai のコネクタとして登録(いちばん簡単・おすすめ)

1. claude.ai → 設定 → コネクタ → 「カスタムコネクタを追加」
2. URLに `https://tips.jp/mcp` を貼り付けて追加
3. 認証(TipsアカウントでのOAuth)を済ませる
4. Claude Code(Web版)のセッションでもコネクタとして使えるようになる

### B. Claude Code(ローカル/CLI)に直接追加

```bash
claude mcp add --transport http tips <TipsのMCPサーバーURL>
```

または、このリポジトリ直下に `.mcp.json` を作る(チームで共有する場合):

```json
{
  "mcpServers": {
    "tips": {
      "type": "http",
      "url": "<TipsのMCPサーバーURL>"
    }
  }
}
```

> URLはTipsのマイページで発行されるものを使う。認証トークンを含む場合は
> `.mcp.json` をコミットせず、環境変数で渡すこと。

## 接続後にできること

- 「この下書き(docs/content/drafts/○○.md)をTipsに投稿して」→ 記事作成
- 「昨日の売上を教えて」→ 売上データ取得(analystエージェントが分析に使う)
- 画像のアップロードもMCP経由で可能

## 運用ルール(CLAUDE.mdの鉄の掟と同じ)

- **公開・価格設定は必ず社長が最終承認**してから実行する
- 下書き投稿(非公開状態)までは自動で進めてよい
