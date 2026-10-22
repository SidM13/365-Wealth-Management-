/* 365 Wealth Management — shared layout, icons and behaviours */
(function () {
  "use strict";
  const C = window.SITE_CONFIG || {};

  /* ---------- Icons (24px, stroke) ---------- */
  const P = {
    pie: '<path d="M21 12A9 9 0 1 1 12 3v9z"/><path d="M15 3.5A9 9 0 0 1 20.5 9H15z"/>',
    calendar: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/><path d="M8.5 15.5l2.2 2.2 4.8-4.8"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/>',
    sun: '<path d="M3 18h18M5.5 18a6.5 6.5 0 0 1 13 0"/><path d="M12 6.5V4M5.2 9.2 3.6 7.6M18.8 9.2l1.6-1.6M21 14h-1.5M4.5 14H3"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    analysis: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.5-4.5"/><path d="M7.5 12.5l2-2 1.5 1.5 2.5-3"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11.5h5"/>',
    phone: '<path d="M5 3.5h3.2l1.6 4.2-2.2 1.4a11 11 0 0 0 7.3 7.3l1.4-2.2 4.2 1.6V19a1.5 1.5 0 0 1-1.6 1.5A16.5 16.5 0 0 1 3.5 5.1 1.5 1.5 0 0 1 5 3.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/>',
    whatsapp: '<path d="M4 20l1.2-3.9A8.5 8.5 0 1 1 8 19z"/><path d="M9 8.6c0 3.4 3 6.4 6.4 6.4l1.1-1.6-1.9-1-1 .9a5 5 0 0 1-2.9-2.9l.9-1-1-1.9z"/>',
    pin: '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev: '<path d="M6 9l6 6 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    chat: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4h0A1.5 1.5 0 0 1 4 14.5z"/><path d="M8.5 9.5h7M8.5 12.5h4"/>',
    send: '<path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4z"/>',
    shield: '<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>',
    building: '<path d="M4 21V8l8-5 8 5v13"/><path d="M2.5 21h19M9 21v-5h6v5M8.5 10.5h1M14.5 10.5h1M8.5 13.5h1M14.5 13.5h1"/>',
    tower: '<path d="M12 3v18M8 21l4-18 4 18M6 10h12M5 15h14"/><circle cx="12" cy="3" r="1"/>',
    umbrella: '<path d="M3 12a9 9 0 0 1 18 0z"/><path d="M12 12v6.5a2 2 0 0 1-4 0"/><path d="M12 3v0"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    refresh: '<path d="M20 11a8 8 0 0 0-14.5-4.5L4 8"/><path d="M4 4v4h4M4 13a8 8 0 0 0 14.5 4.5L20 16"/><path d="M20 20v-4h-4"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14a5 5 0 0 1 5.5 5"/>',
    family: '<circle cx="7" cy="6" r="2.5"/><circle cx="17" cy="6" r="2.5"/><circle cx="12" cy="12" r="2"/><path d="M3 20v-4.5A3.5 3.5 0 0 1 6.5 12h1M21 20v-4.5a3.5 3.5 0 0 0-3.5-3.5h-1M9 20v-1.5a3 3 0 0 1 6 0V20"/>',
    grad: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c2 2 10 2 12 0v-5M22 9v6"/>',
    home: '<path d="M3 11l9-7 9 7"/><path d="M5 9.5V20h14V9.5M10 20v-5h4v5"/>',
    seed: '<path d="M12 21v-9"/><path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7zM12 14c0-3-2.5-5.5-7-5.5 0 3 2.5 5.5 7 5.5z"/>',
    trend: '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
    coins: '<ellipse cx="9" cy="6.5" rx="6" ry="2.5"/><path d="M3 6.5v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4"/><path d="M9 13v4c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-4c0-1.4-2.7-2.5-6-2.5"/>',
    gold: '<path d="M3 19l2.5-6h6L14 19zM10 19l2.5-6h6L21 19z"/><path d="M6.5 13L9 7h6l2.5 6"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.5 14l-1.5 7 5-2.5 5 2.5-1.5-7"/><path d="M9.5 9l1.8 1.8L14.5 7.5"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>',
    alert: '<path d="M12 3l9.5 17h-19z"/><path d="M12 10v4.5M12 17.5v.5"/>',
    calc: '<rect x="5" y="2.5" width="14" height="19" rx="2.5"/><path d="M8 6.5h8v3H8zM8.5 13h.5M12 13h.5M15.5 13h.5M8.5 16.5h.5M12 16.5h.5M15.5 16.5h.5"/>',
    play: '<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5.5 3.5-5.5 3.5z"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14"/><path d="M5 7l-3 6a3 3 0 0 0 6 0zM19 7l-3 6a3 3 0 0 0 6 0z"/>',
    heart: '<path d="M12 20s-8-4.7-8-10.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.3 12 20 12 20z"/>',
    wallet: '<path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3"/><rect x="3.5" y="8" width="17" height="12" rx="2.5"/><path d="M16 14h1.5"/>',
    meeting: '<rect x="3" y="4.5" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M8 14h3M8 17h6"/>',
    lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="2.5"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    drop: '<path d="M12 3s6.5 7 6.5 11.5a6.5 6.5 0 0 1-13 0C5.5 10 12 3 12 3z"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    cart: '<path d="M3 4h2.5l2.2 11h10.6L21 8H7"/><circle cx="9.5" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/>',
    life: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M5.6 5.6l3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6"/>',
    mistake: '<circle cx="12" cy="12" r="9"/><path d="M9 9l6 6M15 9l-6 6"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="2.5"/><path d="M16 8V6.5A2.5 2.5 0 0 0 13.5 4h-7A2.5 2.5 0 0 0 4 6.5v7A2.5 2.5 0 0 0 6.5 16H8"/>',
    silver: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="5"/><path d="M12 9.5v5M10 11h3.2a1.2 1.2 0 0 1 0 2.4H10"/>',
    debt: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M7 10h10M7 14h6"/>'
  };
  function icon(name, cls) {
    return '<svg class="' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[name] || P.info) + "</svg>";
  }
  function hydrateIcons(root) {
    (root || document).querySelectorAll("[data-icon]").forEach(function (el) {
      if (el.dataset.iconDone) return;
      el.insertAdjacentHTML("afterbegin", icon(el.dataset.icon));
      el.dataset.iconDone = "1";
    });
  }

  /* ---------- Guilloche (banknote line pattern) ---------- */
  function guilloche(color, rings) {
    // hypotrochoid rosettes, echoing the security patterns on currency notes
    let paths = "";
    const sets = rings || [[300, 63, 120, 0.35], [250, 41, 95, 0.28], [190, 29, 70, 0.22]];
    sets.forEach(function (s) {
      const R = s[0], r = s[1], d = s[2];
      let dStr = "";
      const steps = 1400;
      for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * Math.PI * 2 * r / gcd(R, r);
        const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
        const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
        dStr += (i ? "L" : "M") + (450 + x).toFixed(1) + " " + (450 + y).toFixed(1);
      }
      paths += '<path d="' + dStr + '" stroke-opacity="' + s[3] + '"/>';
    });
    return '<svg viewBox="0 0 900 900" fill="none" stroke="' + color + '" stroke-width=".6" aria-hidden="true">' + paths + "</svg>";
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }

  /* ---------- Navigation ---------- */
  const SOLUTIONS = [
    ["mutual-funds.html", "pie", "Mutual Funds", "Diversified categories across equity, debt, hybrid & metals"],
    ["sip.html", "calendar", "SIP", "Systematic, disciplined investing"],
    ["sif.html", "layers", "Specialized Investment Funds", "SIF strategies for eligible investors"],
    ["nps-retirement.html", "sun", "NPS & Retirement", "Accumulation to retirement income"],
    ["portfolio-analysis.html", "analysis", "Portfolio Analysis", "Review | Allocate | Grow"],
    ["solutions.html#pms", "briefcase", "PMS", "Portfolio Management Services"],
    ["solutions.html#aif", "compass", "AIF", "Alternative Investment Funds"],
    ["solutions.html#gift-city", "globe", "GIFT City Funds", "International financial-services ecosystem"],
    ["solutions.html#unlisted", "key", "Unlisted Shares", "Opportunities with distinct risks"],
    ["solutions.html#invit-reit", "building", "InvITs & REITs", "Infrastructure & real-estate trusts"],
    ["solutions.html#insurance", "umbrella", "Insurance Solutions", "Protection & risk management"],
    ["calculators.html", "calc", "Financial Calculators", "SIP, NPS, SWP, goal & more"]
  ];
  const NAV = [
    ["index.html", "Home"],
    ["about.html", "About Us"],
    ["solutions.html", "Our Solutions", true],
    ["mutual-funds.html", "Mutual Funds"],
    ["sip.html", "SIP"],
    ["sif.html", "SIF"],
    ["nps-retirement.html", "NPS & Retirement"],
    ["portfolio-analysis.html", "Portfolio Analysis"],
    ["education.html", "Investor Education"],
    ["contact.html", "Contact Us"]
  ];
  const current = (location.pathname.split("/").pop() || "index.html").replace(/\?.*$/, "") || "index.html";
  const isActive = function (href) { return href.split("#")[0] === current || (href === "education.html" && current === "article.html"); };

  function waLink(text) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(text || "Hello 365 Wealth Management, I would like to know more about your investment solutions.");
  }

  function renderHeader() {
    const host = document.getElementById("site-header");
    if (!host) return;
    const ddItems = SOLUTIONS.map(function (s) {
      return '<a href="' + s[0] + '"><span class="dd-ico">' + icon(s[1]) + "</span><span><strong>" + s[2] + "</strong><small>" + s[3] + "</small></span></a>";
    }).join("");
    const navItems = NAV.map(function (n) {
      if (n[2]) {
        return '<li class="has-dd"><button class="dd-toggle" aria-expanded="false" aria-haspopup="true">' + n[1] + icon("chev") + '</button><div class="dropdown" role="menu"><a href="solutions.html" style="grid-column:1/-1"><span class="dd-ico">' + icon("layers") + '</span><span><strong>All Investment Solutions</strong><small>An overview of every category we help investors explore</small></span></a>' + ddItems + "</div></li>";
      }
      return '<li><a href="' + n[0] + '"' + (isActive(n[0]) ? ' class="active" aria-current="page"' : "") + ">" + n[1] + "</a></li>";
    }).join("");
    const drawerItems = NAV.map(function (n) {
      if (n[2]) {
        return '<button class="acc-toggle" aria-expanded="false">' + n[1] + icon("chev") + '</button><div class="acc-panel"><a href="solutions.html">All Investment Solutions</a>' + SOLUTIONS.map(function (s) { return '<a href="' + s[0] + '">' + s[2] + "</a>"; }).join("") + "</div>";
      }
      return '<a href="' + n[0] + '">' + n[1] + "</a>";
    }).join("");

    host.outerHTML =
      '<a class="skip-link" href="#main">Skip to content</a>' +
      '<div class="topbar"><div class="container"><div class="tb-left"><span class="arn">AMFI Registered Mutual Fund Distributor · ARN: ' + C.arn + '</span></div>' +
      '<div class="tb-right"><a href="tel:' + C.phone + '">' + icon("phone") + C.phoneDisplay + '</a><a href="mailto:' + C.email + '">' + icon("mail") + C.email + '</a><a href="' + waLink() + '" target="_blank" rel="noopener">' + icon("whatsapp") + "WhatsApp</a></div></div></div>" +
      '<header class="site-header" id="top"><div class="container">' +
      '<a class="brand" href="index.html" aria-label="365 Wealth Management home"><img src="assets/img/logo/logo-horizontal.svg" alt="365 Wealth Management" width="260" height="50"></a>' +
      '<nav class="main-nav" aria-label="Main"><ul>' + navItems + "</ul></nav>" +
      '<div class="header-cta"><a class="btn btn-gold btn-sm" href="contact.html?type=Portfolio%20Review">Request Review</a>' +
      '<button class="menu-btn" aria-label="Open menu" aria-controls="drawer" aria-expanded="false">' + icon("menu") + "</button></div>" +
      "</div></header>" +
      (document.body.dataset.risk ? '<div class="risk-strip" role="note"><strong>Mutual Fund investments are subject to market risks, read all scheme related documents carefully.</strong></div>' : "") +
      '<div class="drawer-backdrop" data-close-drawer></div>' +
      '<aside class="drawer" id="drawer" aria-label="Menu"><div class="drawer-head"><img src="assets/img/logo/logo-horizontal.svg" alt="365 Wealth Management"><button class="menu-btn" style="display:inline-flex" data-close-drawer aria-label="Close menu">' + icon("close") + "</button></div>" +
      "<nav>" + drawerItems + '<a href="calculators.html">Calculators</a></nav>' +
      '<div class="drawer-foot"><a class="btn btn-gold" href="contact.html?type=Portfolio%20Review">Request Portfolio Review</a><a class="btn btn-ghost" href="tel:' + C.phone + '">' + icon("phone") + "Call " + C.phoneDisplay + '</a><div class="arn">AMFI Registered Mutual Fund Distributor · ARN: ' + C.arn + "</div></div></aside>";
  }

  function renderFooter() {
    const host = document.getElementById("site-footer");
    if (!host) return;
    host.outerHTML =
      '<footer class="site-footer"><div class="container"><div class="f-grid">' +
      '<div class="f-brand"><img src="assets/img/logo/logo-white.svg" alt="365 Wealth Management"><p class="promise">Your Partner in a Brighter Financial Tomorrow</p><span class="f-arn">AMFI Registered Mutual Fund Distributor · ARN: ' + C.arn + "</span></div>" +
      '<div><h4>Quick Links</h4><ul><li><a href="index.html">Home</a></li><li><a href="about.html">About Us</a></li><li><a href="portfolio-analysis.html">Portfolio Analysis</a></li><li><a href="calculators.html">Financial Calculators</a></li><li><a href="education.html">Investor Education</a></li><li><a href="contact.html">Contact</a></li></ul></div>' +
      '<div><h4>Investment Solutions</h4><ul><li><a href="mutual-funds.html">Mutual Funds</a></li><li><a href="sip.html">SIP</a></li><li><a href="sif.html">SIF</a></li><li><a href="nps-retirement.html">NPS &amp; Retirement</a></li><li><a href="solutions.html#pms">PMS &amp; AIF</a></li><li><a href="solutions.html#gift-city">GIFT City Funds</a></li><li><a href="solutions.html#unlisted">Unlisted Shares</a></li><li><a href="solutions.html#invit-reit">InvITs &amp; REITs</a></li></ul></div>' +
      '<div><h4>Contact</h4><ul class="f-contact"><li>' + icon("pin") + "<span><strong style=\"color:#E6EBF2\">Registered Office</strong><br>House No. 50, Sector 8, Faridabad – 121006, Haryana</span></li><li>" + icon("pin") + '<span><strong style="color:#E6EBF2">Branch Office</strong><br>House No. 414, Sector 40, Gurugram – 122003, Haryana</span></li><li>' + icon("phone") + '<a href="tel:' + C.phone + '">' + C.phoneDisplay + "</a></li><li>" + icon("mail") + '<a href="mailto:' + C.email + '">' + C.email + "</a></li></ul></div>" +
      "</div>" +
      '<div class="f-disclaimer"><span class="mf-risk">Mutual Fund investments are subject to market risks, read all scheme related documents carefully.</span>' +
      "<p><strong>Nature of services:</strong> 365 Wealth Management (Proprietor: Pankaj Manchanda) is an AMFI Registered Mutual Fund Distributor (ARN: " + C.arn + "). We distribute mutual fund schemes and may receive commission from Asset Management Companies. We are <strong>not</strong> a SEBI Registered Investment Adviser and do not provide investment advisory services for a fee. Investor education and portfolio analysis are offered as part of our distribution services and should not be construed as investment advice. Other products (PMS, AIF, SIF, NPS, GIFT City funds, unlisted shares, insurance) are offered subject to applicable registrations, eligibility norms and regulations of SEBI, PFRDA, IFSCA and IRDAI, as relevant.</p>" +
      "<p>Past performance may or may not be sustained in future and is not a guarantee of future returns. Calculator outputs are illustrations only. Investors should read all offer and scheme related documents and consult their own tax/legal advisers before investing. <a href=\"disclaimer.html\">Read full disclaimer</a>.</p></div>" +
      '<div class="f-bottom"><span>© ' + new Date().getFullYear() + ' 365 Wealth Management. PLAN | INVEST | GROW | SECURE</span><nav aria-label="Legal"><a href="privacy.html">Privacy Policy</a><a href="terms.html">Terms &amp; Conditions</a><a href="disclaimer.html">Disclaimer</a></nav></div>' +
      "</div></footer>" +
      '<nav class="mobile-bar" aria-label="Quick contact"><a href="tel:' + C.phone + '">' + icon("phone") + 'Call</a><a href="' + waLink() + '" target="_blank" rel="noopener">' + icon("whatsapp") + 'WhatsApp</a><button type="button" data-open-chat>' + icon("chat") + "Ask Us</button></nav>";
  }

  /* ---------- Behaviours ---------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (header) {
      const onScroll = function () { header.classList.toggle("scrolled", window.scrollY > 8); };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
    document.querySelectorAll(".has-dd").forEach(function (li) {
      const btn = li.querySelector(".dd-toggle");
      btn.addEventListener("click", function () {
        const open = !li.classList.contains("open");
        li.classList.toggle("open", open);
        btn.setAttribute("aria-expanded", open);
      });
      li.addEventListener("keydown", function (e) { if (e.key === "Escape") { li.classList.remove("open"); btn.focus(); } });
      document.addEventListener("click", function (e) { if (!li.contains(e.target)) li.classList.remove("open"); });
    });
    const open = document.querySelector(".header-cta .menu-btn");
    const setDrawer = function (v) {
      document.body.classList.toggle("drawer-open", v);
      if (open) open.setAttribute("aria-expanded", v);
    };
    if (open) open.addEventListener("click", function () { setDrawer(true); });
    document.querySelectorAll("[data-close-drawer]").forEach(function (b) { b.addEventListener("click", function () { setDrawer(false); }); });
    document.querySelectorAll(".drawer nav a").forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });
    document.querySelectorAll(".acc-toggle").forEach(function (b) {
      b.addEventListener("click", function () {
        const ex = b.getAttribute("aria-expanded") === "true";
        b.setAttribute("aria-expanded", !ex);
        b.nextElementSibling.classList.toggle("open", !ex);
      });
    });
  }

  function initReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(function (e) { io.observe(e); });
  }

  function initCountUps() {
    const els = document.querySelectorAll("[data-count]");
    if (!els.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        const el = en.target, end = parseFloat(el.dataset.count), suf = el.dataset.suffix || "";
        io.unobserve(el);
        if (reduce) { el.textContent = end + suf; return; }
        const t0 = performance.now();
        (function tick(t) {
          const p = Math.min(1, (t - t0) / 1400), v = Math.round(end * (1 - Math.pow(1 - p, 3)));
          el.textContent = v + suf;
          if (p < 1) requestAnimationFrame(tick);
        })(t0);
      });
    }, { threshold: 0.5 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Tickets & inbox delivery (shared with chatbot) ---------- */
  function makeTicket() {
    const d = new Date(), pad = function (n) { return String(n).padStart(2, "0"); };
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let r = "";
    const buf = new Uint32Array(4);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    buf.forEach(function (n) { r += chars[n % chars.length]; });
    return "365-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + r;
  }
  async function sendToInbox(fields) {
    if (!C.web3formsKey || C.web3formsKey.indexOf("YOUR_") === 0) throw new Error("not-configured");
    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(Object.assign({ access_key: C.web3formsKey, from_name: "365 Wealth Management Website" }, fields))
    });
    const data = await res.json().catch(function () { return {}; });
    if (!res.ok || !data.success) throw new Error(data.message || "send-failed");
    return data;
  }
  function mailtoLink(subject, body) {
    return "mailto:" + C.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }

  /* ---------- Enquiry form ---------- */
  function initEnquiry() {
    const form = document.getElementById("enquiry-form");
    if (!form) return;
    const params = new URLSearchParams(location.search);
    const preset = params.get("type");
    if (preset) {
      const sel = form.querySelector("[name=requirement]");
      Array.from(sel.options).forEach(function (o) { if (o.value.toLowerCase() === preset.toLowerCase()) sel.value = o.value; });
      if (!sel.value && /meeting/i.test(preset)) { sel.value = "Other"; form.querySelector("[name=message]").value = "I would like to request a meeting."; }
      if (!sel.value && /review/i.test(preset)) sel.value = "Portfolio Review";
      if (!sel.value && /retire/i.test(preset)) sel.value = "Retirement Planning";
    }
    const status = document.getElementById("form-status");
    const rules = {
      name: function (v) { return v.trim().length >= 2; },
      mobile: function (v) { return /^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v.trim()); },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
      city: function (v) { return v.trim().length >= 2; },
      age: function (v) { return !!v; },
      requirement: function (v) { return !!v; },
      consent: function (_, el) { return el.checked; }
    };
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      let ok = true, first = null;
      Object.keys(rules).forEach(function (k) {
        const el = form.elements[k];
        const valid = rules[k](el.value, el);
        el.closest(".f").classList.toggle("invalid", !valid);
        if (!valid) { ok = false; first = first || el; }
      });
      if (!ok) { first.focus(); return; }
      if (form.elements.botcheck && form.elements.botcheck.checked) return;
      const ticket = makeTicket();
      const f = form.elements;
      const fields = {
        subject: "Website Enquiry " + ticket + " — " + f.requirement.value,
        ticket: ticket, name: f.name.value, mobile: f.mobile.value, email: f.email.value,
        city: f.city.value, age_group: f.age.value, requirement: f.requirement.value,
        message: f.message.value || "-", consent: "Yes — consented to be contacted", page: location.href
      };
      const btn = form.querySelector("[type=submit]");
      btn.disabled = true; btn.textContent = "Sending…";
      status.className = "form-status";
      try {
        await sendToInbox(fields);
        status.innerHTML = "<strong>Thank you, " + escapeHtml(f.name.value.split(" ")[0]) + ".</strong> Your request has been received. Your reference number is <span class=\"ticket\">" + ticket + "</span><br>We will get in touch with you shortly. Please quote this number in any follow-up.";
        status.className = "form-status show ok";
        form.reset();
      } catch (err) {
        const body = Object.keys(fields).map(function (k) { return k + ": " + fields[k]; }).join("\n");
        status.innerHTML = "<strong>Your reference number is <span class=\"ticket\">" + ticket + "</span></strong><br>We couldn't send the form automatically. Please <a href=\"" + mailtoLink(fields.subject, body) + "\">send it by email</a> or <a href=\"" + waLink("Enquiry " + ticket + ": " + fields.requirement + " — " + fields.name) + "\" target=\"_blank\" rel=\"noopener\">message us on WhatsApp</a>.";
        status.className = "form-status show err";
      }
      btn.disabled = false; btn.textContent = "Submit Enquiry";
      status.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; });
  }

  function initWaLinks() {
    document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = waLink(a.dataset.wa || undefined); a.target = "_blank"; a.rel = "noopener"; });
    document.querySelectorAll("[data-tel]").forEach(function (a) { a.href = "tel:" + C.phone; });
    document.querySelectorAll("[data-mail]").forEach(function (a) { a.href = "mailto:" + C.email + (a.dataset.mail ? "?subject=" + encodeURIComponent(a.dataset.mail) : ""); });
  }

  function initGuilloche() {
    document.querySelectorAll(".guilloche").forEach(function (g) {
      g.innerHTML = guilloche(g.dataset.color || "#C9A24B");
    });
  }

  window.W365 = { icon: icon, hydrateIcons: hydrateIcons, makeTicket: makeTicket, sendToInbox: sendToInbox, mailtoLink: mailtoLink, waLink: waLink, escapeHtml: escapeHtml, config: C };

  renderHeader();
  renderFooter();
  hydrateIcons();
  initGuilloche();
  initHeader();
  initReveal();
  initCountUps();
  initWaLinks();
  initEnquiry();
})();
