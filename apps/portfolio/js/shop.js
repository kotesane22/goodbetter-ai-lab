/* shop.js — data/shop.json を読み込み販売リンクカードを描画（外部リンクのみ） */
(function () {
  "use strict";

  var mount = document.querySelector("[data-shop]");
  if (!mount) return;

  var esc = function (s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  };

  fetch("data/shop.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("shop.json load failed: " + r.status);
      return r.json();
    })
    .then(function (data) { render(data.items || []); })
    .catch(function (err) {
      mount.innerHTML = '<p class="gallery__empty">販売リンクを読み込めませんでした。</p>';
      if (window.console) console.error(err);
    });

  function render(items) {
    if (!items.length) {
      mount.innerHTML = '<p class="gallery__empty">販売リンクは準備中です。</p>';
      return;
    }
    mount.innerHTML = items.map(cardHTML).join("");
  }

  function cardHTML(it) {
    var hasLink = it.url && it.url.length;
    var el = hasLink ? "a" : "div";
    var attr = hasLink ? ' href="' + esc(it.url) + '" target="_blank" rel="noopener"' : ' aria-disabled="true"';
    var go = hasLink
      ? 'ショップを見る <span aria-hidden="true">&rarr;</span>'
      : '準備中';
    return (
      "<" + el + ' class="shopcard"' + attr + ">" +
        '<span class="shopcard__badge" style="background:' + esc(it.color || "#0d7c76") + '">' + esc(it.badge || "") + "</span>" +
        '<h3 class="shopcard__name">' + esc(it.name) + "</h3>" +
        '<p class="shopcard__desc">' + esc(it.description || "") + "</p>" +
        '<span class="shopcard__go">' + go + "</span>" +
        (it.note ? '<span class="shopcard__note">' + esc(it.note) + "</span>" : "") +
      "</" + el + ">"
    );
  }
})();
