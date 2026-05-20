# apps/ai-employee

AI社員が使用するスクリプト群。

## writer.py

コンテンツを `output/` ディレクトリに保存するユーティリティ。

```bash
# X投稿を保存
python3 apps/ai-employee/writer.py x_post "トピック名" "投稿内容"

# note草稿を保存
python3 apps/ai-employee/writer.py note "記事タイトル" "記事本文"

# リサーチレポートを保存
python3 apps/ai-employee/writer.py research "調査テーマ" "レポート内容"
```
