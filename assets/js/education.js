/* Investor Education Centre — renders cards and articles from assets/data/articles.json */
(function () {
  "use strict";
  const W = window.W365, icon = W.icon, esc = W.escapeHtml;
  const PRODUCT_CATS = ["Mutual Funds", "Advanced Products", "Retirement"];

  function card(a) {
    return '<a class="card article-card" href="article.html?slug=' + encodeURIComponent(a.slug) + '">' +
      '<div class="ac-thumb"><span class="ac-type">' + icon(a.youtubeId ? "play" : "book") + (a.youtubeId ? "Video" : "Article") + "</span>" + icon(a.icon, "ac-ico") + "</div>" +
      '<div class="ac-body"><span class="ac-cat">' + esc(a.category) + "</span><h3>" + esc(a.title) + "</h3><p>" + esc(a.summary) + '</p><span class="link-arrow">' + (a.youtubeId ? "Watch" : "Read") + " · " + a.minutes + " min " + icon("arrow") + "</span></div></a>";
  }

  function load() {
    return fetch("assets/data/articles.json").then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }

  /* ---------- Listing ---------- */
  const grid = document.getElementById("edu-grid");
  if (grid) {
    load().then(function (items) {
      const chips = document.getElementById("edu-chips"), search = document.getElementById("edu-search");
      const cats = ["All"].concat(Array.from(new Set(items.map(function (a) { return a.category; }))));
      if (items.some(function (a) { return a.youtubeId; })) cats.push("Videos");
      let cat = "All";
      chips.innerHTML = cats.map(function (c, i) { return '<button type="button" aria-pressed="' + (i === 0) + '" data-cat="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
      function render() {
        const q = search.value.trim().toLowerCase();
        const list = items.filter(function (a) {
          const inCat = cat === "All" || (cat === "Videos" ? !!a.youtubeId : a.category === cat);
          return inCat && (!q || (a.title + " " + a.summary + " " + a.category).toLowerCase().indexOf(q) > -1);
        });
        grid.innerHTML = list.length ? list.map(card).join("") : '<div class="empty-state" style="grid-column:1/-1">No topics match your search. <button class="btn btn-ghost btn-sm" type="button" data-open-chat>Ask 365 Assistant</button></div>';
      }
      chips.addEventListener("click", function (e) {
        const b = e.target.closest("button"); if (!b) return;
        cat = b.dataset.cat;
        chips.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
        render();
      });
      search.addEventListener("input", render);
      render();
    }).catch(function () { grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">Content could not be loaded. Please refresh the page.</div>'; });
  }

  /* ---------- Single article ---------- */
  const art = document.getElementById("article");
  if (art) {
    const slug = new URLSearchParams(location.search).get("slug");
    load().then(function (items) {
      const a = items.find(function (x) { return x.slug === slug; });
      if (!a) { location.replace("education.html"); return; }
      document.title = a.title + " | Investor Education | 365 Wealth Management";
      const meta = document.querySelector('meta[name="description"]'); if (meta) meta.content = a.summary;
      document.getElementById("a-cat").textContent = a.category;
      document.getElementById("a-title").textContent = a.title;
      document.getElementById("a-sum").textContent = a.summary;
      document.getElementById("a-crumb").textContent = a.title;
      // Article bodies are first-party content from articles.json.
      art.innerHTML = (a.youtubeId ? '<div class="video-embed"><iframe src="https://www.youtube-nocookie.com/embed/' + encodeURIComponent(a.youtubeId) + '" title="' + esc(a.title) + '" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>' : "") + a.body;
      const disc = document.getElementById("a-disc");
      disc.innerHTML = '<h4>' + (PRODUCT_CATS.indexOf(a.category) > -1 ? "Risk disclosure" : "Please note") + "</h4><p>This article is for general investor education and is not investment, tax or legal advice. " +
        (PRODUCT_CATS.indexOf(a.category) > -1 ? "Products mentioned are subject to applicable regulations, eligibility norms and risks. " : "") +
        "<strong>Mutual Fund investments are subject to market risks, read all scheme related documents carefully.</strong></p>";
      const rel = items.filter(function (x) { return x.category === a.category && x.slug !== a.slug; }).slice(0, 3);
      const more = rel.length < 3 ? items.filter(function (x) { return x.slug !== a.slug && rel.indexOf(x) < 0; }).slice(0, 3 - rel.length) : [];
      document.getElementById("a-related").innerHTML = rel.concat(more).map(card).join("");
    }).catch(function () { art.innerHTML = "<p>Content could not be loaded. Please refresh the page.</p>"; });
  }
})();
