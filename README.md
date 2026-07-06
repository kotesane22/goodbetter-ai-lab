# goodbetter-ai-lab

## 研修後 行動変容診断ツール

企業研修の受講後に、行動がどう変わったかを本人が診断するWebツール。

- **公開URL**: https://kotesane22.github.io/goodbetter-ai-lab/
- **ソース**: [`apps/diagnostic-tool`](apps/diagnostic-tool)

### 特徴

- シナリオ4択（3場面）＋振り返り5段階評価（4問）
- APIキー・サーバー不要（完全クライアントサイド）
- スマートフォン対応
- スコア・強み・成長テーマ・アクションを自動で提示

### ローカルで動かす

```bash
cd apps/diagnostic-tool
npm install
npm run dev
# → http://localhost:3000
```

`main` への push で GitHub Pages へ自動デプロイされます。
