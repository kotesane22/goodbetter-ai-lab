#!/usr/bin/env bash
# apps/portfolio/ の内容を公開先リポジトリ kotesane22/ikep のルートへ反映する。
#
#   使い方:  ./scripts/sync-to-ikep.sh "コミットメッセージ"
#
# ikep のクローンが無ければ作成する。push すると GitHub Pages が自動で再ビルドされる。
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/apps/portfolio"
DEST="${IKEP_DIR:-$HOME/ikep}"
MSG="${1:-chore: サイトを更新}"

[ -d "$SRC" ] || { echo "ソースが見つかりません: $SRC" >&2; exit 1; }

if [ ! -d "$DEST/.git" ]; then
  echo "→ ikep をクローンします: $DEST"
  git clone https://github.com/kotesane22/ikep "$DEST"
fi

echo "→ 最新を取得"
git -C "$DEST" checkout -q main
git -C "$DEST" pull -q --ff-only origin main

echo "→ ファイルを反映"
# 公開物は apps/portfolio の中身をそのままルートに置く（相対パス設計のため無改変で動く）
cp -r "$SRC"/. "$DEST"/

if git -C "$DEST" diff --quiet && git -C "$DEST" diff --cached --quiet; then
  echo "変更はありません。"
  exit 0
fi

git -C "$DEST" add -A
git -C "$DEST" status --short
git -C "$DEST" commit -q -m "$MSG"

echo "→ push"
for i in 1 2 3 4; do
  if git -C "$DEST" push origin main; then
    echo "✓ 反映しました。数分で https://kotesane22.github.io/ikep/ に公開されます。"
    exit 0
  fi
  wait=$((2 ** i))
  echo "push に失敗。${wait}秒後に再試行..." >&2
  sleep "$wait"
done

echo "push に失敗しました。ネットワークを確認してください。" >&2
exit 1
