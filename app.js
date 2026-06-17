/* BigFatPrompts — client app */
(function () {
  "use strict";

  var CONFIG = (window.SITE || {});
  var GITHUB_URL = CONFIG.github || "https://github.com/wayfdigital/bigfatprompts";
  var SUBMIT_URL = CONFIG.submit || (GITHUB_URL + "/issues/new?title=New%20prompt%20submission&body=" +
    encodeURIComponent("**Title:**\n\n**Category:**\n\n**Prompt:**\n\n**Who it's for:**\n"));

  var CATEGORIES = window.CATEGORIES || [];
  var PROMPTS = window.PROMPTS || [];

  var state = { q: "", cat: "all", sort: "featured" };
  var votes = loadVotes();

  // ----- helpers -----
  function loadVotes() {
    try { return JSON.parse(localStorage.getItem("bfp_votes") || "{}"); }
    catch (e) { return {}; }
  }
  function saveVotes() {
    try { localStorage.setItem("bfp_votes", JSON.stringify(votes)); } catch (e) {}
  }
  function hash(str) {
    var h = 0; for (var i = 0; i < str.length; i++) { h = (h << 5) - h + str.charCodeAt(i); h |= 0; }
    return Math.abs(h);
  }
  function baseVotes(p) {
    var b = 20 + (hash(p.slug) % 260);
    if (p.featured) b += 140;
    return b;
  }
  function totalVotes(p) { return baseVotes(p) + (votes[p.slug] ? 1 : 0); }
  function catName(slug) {
    for (var i = 0; i < CATEGORIES.length; i++) if (CATEGORIES[i].slug === slug) return CATEGORIES[i].name;
    return slug;
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function el(id) { return document.getElementById(id); }

  // ----- filtering / sorting -----
  function filtered() {
    var q = state.q.trim().toLowerCase();
    var list = PROMPTS.filter(function (p) {
      if (state.cat !== "all" && p.category !== state.cat) return false;
      if (!q) return true;
      var hay = (p.title + " " + p.description + " " + p.prompt + " " + (p.tags || []).join(" ") + " " + catName(p.category)).toLowerCase();
      return hay.indexOf(q) !== -1;
    });
    if (state.sort === "az") list.sort(function (a, b) { return a.title.localeCompare(b.title); });
    else if (state.sort === "top") list.sort(function (a, b) { return totalVotes(b) - totalVotes(a); });
    else list.sort(function (a, b) {
      if (!!b.featured !== !!a.featured) return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return baseVotes(b) - baseVotes(a);
    });
    return list;
  }

  // ----- rendering -----
  function renderCategories() {
    var wrap = el("categories");
    var counts = {};
    PROMPTS.forEach(function (p) { counts[p.category] = (counts[p.category] || 0) + 1; });
    var html = pill("all", "All", PROMPTS.length);
    CATEGORIES.forEach(function (c) { html += pill(c.slug, c.name, counts[c.slug] || 0); });
    wrap.innerHTML = html;
    wrap.querySelectorAll(".cat-pill").forEach(function (b) {
      b.addEventListener("click", function () {
        state.cat = b.getAttribute("data-cat");
        wrap.querySelectorAll(".cat-pill").forEach(function (x) {
          x.setAttribute("aria-pressed", x.getAttribute("data-cat") === state.cat ? "true" : "false");
        });
        renderGrid();
      });
    });
  }
  function pill(slug, name, count) {
    var pressed = state.cat === slug ? "true" : "false";
    return '<button class="cat-pill" data-cat="' + esc(slug) + '" aria-pressed="' + pressed + '">' +
      esc(name) + '<span class="pill-count">' + count + "</span></button>";
  }

  function renderGrid() {
    var list = filtered();
    el("count").textContent = list.length;
    var grid = el("grid");
    el("empty").hidden = list.length !== 0;
    grid.innerHTML = list.map(cardHTML).join("");
    grid.querySelectorAll(".card").forEach(function (card) {
      var slug = card.getAttribute("data-slug");
      card.addEventListener("click", function (e) {
        if (e.target.closest("button")) return;
        openModal(slug);
      });
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(slug); }
      });
      card.querySelector(".copy").addEventListener("click", function (e) {
        e.stopPropagation(); copyPrompt(slug, e.currentTarget);
      });
      card.querySelector(".vote").addEventListener("click", function (e) {
        e.stopPropagation(); toggleVote(slug);
      });
    });
  }

  function cardHTML(p) {
    var voted = !!votes[p.slug];
    return '<article class="card" tabindex="0" data-slug="' + esc(p.slug) + '">' +
      '<div class="card-top"><span class="card-cat">' + esc(catName(p.category)) + '</span>' +
        '<span class="diff ' + esc(p.difficulty) + '">' + esc(p.difficulty) + "</span></div>" +
      '<h3 class="card-title">' + esc(p.title) + "</h3>" +
      '<p class="card-desc">' + esc(p.description) + "</p>" +
      '<div class="card-prompt">' + esc(p.prompt) + "</div>" +
      '<div class="card-tags">' + (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") + "</div>" +
      '<div class="card-foot"><div class="btn-row">' +
        '<button class="icon-btn copy" aria-label="Copy prompt">' + iconCopy() + "Copy</button>" +
        '<button class="icon-btn vote ' + (voted ? "voted" : "") + '" aria-label="Upvote">' + iconUp() +
          '<span class="vote-count">' + totalVotes(p) + "</span></button>" +
      "</div></div></article>";
  }

  function iconCopy() { return '<svg viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10" stroke="currentColor" stroke-width="2"/></svg>'; }
  function iconUp() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7-7 7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  // ----- actions -----
  function findPrompt(slug) {
    for (var i = 0; i < PROMPTS.length; i++) if (PROMPTS[i].slug === slug) return PROMPTS[i];
    return null;
  }
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
    return new Promise(function (res) {
      var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta);
      ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); res();
    });
  }
  function copyPrompt(slug, btn) {
    var p = findPrompt(slug); if (!p) return;
    copyText(p.prompt).then(function () {
      toast("Prompt copied to clipboard");
      if (btn) {
        btn.classList.add("copied");
        var prev = btn.innerHTML; btn.innerHTML = iconCheck() + "Copied";
        setTimeout(function () { btn.classList.remove("copied"); btn.innerHTML = prev; }, 1400);
      }
    });
  }
  function iconCheck() { return '<svg viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  function toggleVote(slug) {
    if (votes[slug]) delete votes[slug]; else votes[slug] = 1;
    saveVotes();
    renderGrid();
    if (currentModalSlug === slug) renderModalVote();
  }

  function toast(msg) {
    var t = el("toast"); t.textContent = msg; t.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  // ----- modal -----
  var currentModalSlug = null;
  function openModal(slug) {
    var p = findPrompt(slug); if (!p) return;
    currentModalSlug = slug;
    el("modal-content").innerHTML =
      '<div class="modal-cat">' + esc(catName(p.category)) + "</div>" +
      '<h2 class="modal-title" id="modal-title">' + esc(p.title) + "</h2>" +
      '<p class="modal-desc">' + esc(p.description) + "</p>" +
      '<div class="modal-prompt" id="modal-prompt">' + esc(p.prompt) + "</div>" +
      '<div class="modal-meta"><span class="diff ' + esc(p.difficulty) + '">' + esc(p.difficulty) + "</span>" +
        (p.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + "</span>"; }).join("") +
        (p.useCase ? '<span class="tag">' + esc(p.useCase) + "</span>" : "") + "</div>" +
      '<div class="modal-actions">' +
        '<button class="btn-primary" id="modal-copy">' + iconCopy() + "Copy prompt</button>" +
        '<button class="btn-ghost" id="modal-vote">' + iconUp() + '<span id="modal-votecount"></span></button>' +
      "</div>" +
      '<p class="modal-tip">Paste this into the Framer agent (⌘ + the agent panel in Framer 3.0). Tweak the <span style="color:var(--fg-muted)">[bracketed]</span> bits for your project.</p>';
    renderModalVote();
    el("modal-copy").addEventListener("click", function (e) {
      copyText(p.prompt).then(function () {
        toast("Prompt copied");
        var b = e.currentTarget; b.classList.add("copied"); b.innerHTML = iconCheck() + "Copied!";
        setTimeout(function () { b.classList.remove("copied"); b.innerHTML = iconCopy() + "Copy prompt"; }, 1500);
      });
    });
    el("modal-vote").addEventListener("click", function () { toggleVote(p.slug); });
    var m = el("modal"); m.hidden = false; document.body.style.overflow = "hidden";
  }
  function renderModalVote() {
    var p = findPrompt(currentModalSlug); if (!p) return;
    var b = el("modal-vote"); var c = el("modal-votecount");
    if (!b || !c) return;
    c.textContent = totalVotes(p) + (votes[p.slug] ? " · upvoted" : " upvotes");
    b.classList.toggle("voted", !!votes[p.slug]);
  }
  function closeModal() {
    el("modal").hidden = true; document.body.style.overflow = ""; currentModalSlug = null;
  }

  // ----- init -----
  function init() {
    el("stat-prompts").textContent = PROMPTS.length;
    el("stat-categories").textContent = CATEGORIES.length;
    var gh = el("nav-github"); if (gh) gh.href = GITHUB_URL;
    var ghf = el("footer-github"); if (ghf) ghf.href = GITHUB_URL;
    ["nav-submit", "footer-submit"].forEach(function (id) {
      var a = el(id); if (a) { a.href = SUBMIT_URL; a.target = "_blank"; a.rel = "noopener"; }
    });

    renderCategories();
    renderGrid();

    el("search").addEventListener("input", function (e) { state.q = e.target.value; renderGrid(); });
    el("sort").addEventListener("change", function (e) { state.sort = e.target.value; renderGrid(); });

    document.querySelectorAll("[data-close]").forEach(function (x) { x.addEventListener("click", closeModal); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !el("modal").hidden) closeModal();
      if (e.key === "/" && document.activeElement !== el("search")) {
        var tag = (document.activeElement && document.activeElement.tagName) || "";
        if (tag !== "INPUT" && tag !== "TEXTAREA") { e.preventDefault(); el("search").focus(); }
      }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
