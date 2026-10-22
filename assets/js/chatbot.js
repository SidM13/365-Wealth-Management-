/* 365 Assistant — website chat widget with human escalation + ticketing */
(function () {
  "use strict";
  const W = window.W365, C = W.config, icon = W.icon, esc = W.escapeHtml;
  const STORE = "w365-chat-v1";

  const WELCOME = "Namaste! I'm the 365 Assistant. I can explain mutual funds, SIPs, NPS, retirement planning, SIFs and more.\n\nI share general information, not investment advice. For anything specific to you, I can connect you with the 365 Wealth Management team.";
  const QUICK = ["What is a SIP?", "How does NPS work?", "What is a SIF?", "Request a portfolio review", "Talk to a human"];

  let state = load() || { messages: [], log: [], escalated: false, ticket: null };
  let busy = false;

  function load() { try { return JSON.parse(sessionStorage.getItem(STORE)); } catch (e) { return null; } }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* storage unavailable */ } }

  /* ---------- DOM ---------- */
  document.body.insertAdjacentHTML("beforeend",
    '<button class="chat-fab" type="button" aria-label="Open chat with 365 Assistant" data-open-chat><span class="fab-ico">' + icon("chat") + "</span>Ask 365 Assistant</button>" +
    '<section class="chat-panel" role="dialog" aria-modal="false" aria-label="365 Assistant chat">' +
    '<div class="chat-head"><img src="assets/img/logo/logo-mark.svg" alt=""><div><strong>365 Assistant</strong><small>Investor education · replies instantly</small></div><button class="chat-close" type="button" aria-label="Close chat">' + icon("close") + "</button></div>" +
    '<div class="chat-body" aria-live="polite"></div>' +
    '<div class="quick"></div>' +
    '<div class="chat-foot"><form class="chat-input"><label class="sr-only" for="chat-text">Type your question</label><textarea id="chat-text" rows="1" maxlength="' + C.chatMaxChars + '" placeholder="Ask about SIP, NPS, mutual funds…"></textarea><button class="send" type="submit" aria-label="Send">' + icon("send") + "</button></form>" +
    '<div class="chat-meta"><span>General information only, not investment advice.</span><button type="button" class="to-human">Talk to a human</button></div></div>' +
    "</section>");

  const panel = document.querySelector(".chat-panel");
  const body = panel.querySelector(".chat-body");
  const quick = panel.querySelector(".quick");
  const form = panel.querySelector(".chat-input");
  const ta = form.querySelector("textarea");
  const sendBtn = form.querySelector(".send");

  function open() {
    document.body.classList.add("chat-open");
    if (!body.childElementCount) renderAll();
    setTimeout(function () { ta.focus(); }, 250);
  }
  function close() { document.body.classList.remove("chat-open"); }
  document.addEventListener("click", function (e) { if (e.target.closest("[data-open-chat]")) { e.preventDefault(); open(); } });
  panel.querySelector(".chat-close").addEventListener("click", close);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && document.body.classList.contains("chat-open")) close(); });

  /* ---------- Rendering ---------- */
  function linkify(text) {
    return esc(text).replace(/\b([a-z-]+\.html(?:#[a-z-]+)?)\b/g, '<a href="$1">$1</a>');
  }
  function bubble(role, text, persist) {
    const el = document.createElement("div");
    el.className = "msg " + role;
    el.innerHTML = role === "bot" ? linkify(text) : esc(text);
    body.appendChild(el);
    if (persist) { state.log.push({ role: role, text: text }); save(); }
    scroll();
    return el;
  }
  function scroll() { body.scrollTop = body.scrollHeight; }
  function renderQuick() {
    quick.innerHTML = "";
    if (state.escalated || state.messages.length > 2) return;
    QUICK.forEach(function (q) {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = q;
      b.addEventListener("click", function () { handleUser(q); });
      quick.appendChild(b);
    });
  }
  function renderAll() {
    body.innerHTML = "";
    bubble("bot", WELCOME, false);
    state.log.forEach(function (m) { bubble(m.role, m.text, false); });
    if (state.ticket) ticketCard(state.ticket, false);
    else if (state.escalated) escalationForm(null);
    renderQuick();
  }

  /* ---------- Conversation ---------- */
  ta.addEventListener("input", function () { ta.style.height = "auto"; ta.style.height = Math.min(ta.scrollHeight, 120) + "px"; });
  ta.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener("submit", function (e) { e.preventDefault(); const t = ta.value.trim(); if (t) handleUser(t); });
  panel.querySelector(".to-human").addEventListener("click", function () { startEscalation("wants_human", "Of course. Please share your details below and a member of our team will contact you."); });

  const HUMAN_RE = /\b(talk|speak|connect|call)\b.*\b(human|person|someone|agent|advisor|adviser|pankaj|team)\b|^talk to a human$/i;

  async function handleUser(text) {
    if (busy) return;
    ta.value = ""; ta.style.height = "auto";
    quick.innerHTML = "";
    bubble("user", text, true);
    state.messages.push({ role: "user", content: text });
    save();

    if (HUMAN_RE.test(text)) { startEscalation("wants_human", "Sure. Please share your details and our team will get in touch."); return; }
    const userCount = state.messages.filter(function (m) { return m.role === "user"; }).length;
    if (userCount > C.chatMaxMessages) { startEscalation("limit", "We've covered a lot! To continue, let me connect you with our team directly."); return; }

    busy = true; sendBtn.disabled = true;
    const typing = document.createElement("div");
    typing.className = "msg bot"; typing.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
    body.appendChild(typing); scroll();

    try {
      const ctrl = new AbortController();
      const timer = setTimeout(function () { ctrl.abort(); }, 30000);
      const res = await fetch(C.chatEndpoint, {
        method: "POST", headers: { "Content-Type": "application/json" }, signal: ctrl.signal,
        body: JSON.stringify({ messages: state.messages.slice(-20) })
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error("http " + res.status);
      const data = await res.json();
      if (!data || typeof data.reply !== "string") throw new Error("bad response");
      typing.remove();
      bubble("bot", data.reply, true);
      state.messages.push({ role: "assistant", content: data.reply });
      save();
      if (data.escalate) startEscalation(data.reason, null);
    } catch (err) {
      typing.remove();
      startEscalation("unavailable", "I'm unable to answer that right now. Let me connect you with our team so your question doesn't go unanswered.");
    } finally {
      busy = false; sendBtn.disabled = false;
    }
  }

  /* ---------- Escalation ---------- */
  function startEscalation(reason, msg) {
    if (msg) bubble("bot", msg, true);
    if (state.ticket) { ticketCard(state.ticket, false); return; }
    if (body.querySelector(".esc-form")) { body.querySelector(".esc-form").scrollIntoView({ block: "nearest" }); return; }
    state.escalated = true; state.reason = reason; save();
    escalationForm(reason);
  }

  function escalationForm() {
    const f = document.createElement("form");
    f.className = "esc-form"; f.noValidate = true;
    f.innerHTML =
      "<h5>Connect with the 365 Wealth Management team</h5><p>We'll create a ticket and share it with our team along with this conversation.</p>" +
      '<input name="name" placeholder="Full name *" autocomplete="name" required>' +
      '<input name="mobile" placeholder="Mobile number *" inputmode="tel" autocomplete="tel" required>' +
      '<input name="email" type="email" placeholder="Email *" autocomplete="email" required>' +
      '<input name="city" placeholder="City" autocomplete="address-level2">' +
      '<textarea name="note" placeholder="Anything else we should know? (optional)"></textarea>' +
      '<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off">' +
      '<label class="consent"><input type="checkbox" name="consent"> I authorise 365 Wealth Management to contact me by call, SMS, WhatsApp or email about my query. This overrides any DND registration.</label>' +
      '<div class="err" hidden></div>' +
      '<div class="esc-actions"><button class="btn btn-navy btn-sm" type="submit">Create ticket</button><button class="btn btn-ghost btn-sm" type="button" data-cancel>Not now</button></div>';
    body.appendChild(f); scroll();

    f.querySelector("[data-cancel]").addEventListener("click", function () {
      f.remove(); state.escalated = false; save();
      bubble("bot", "No problem. You can also reach us anytime on " + C.phoneDisplay + " or " + C.email + ".", true);
    });

    f.addEventListener("submit", async function (e) {
      e.preventDefault();
      const v = function (n) { return (f.elements[n].value || "").trim(); };
      const errEl = f.querySelector(".err");
      let err = "";
      if (v("name").length < 2) err = "Please enter your name.";
      else if (!/^(\+?91[\s-]?)?[6-9]\d{4}[\s-]?\d{5}$/.test(v("mobile"))) err = "Please enter a valid 10-digit Indian mobile number.";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v("email"))) err = "Please enter a valid email address.";
      else if (!f.elements.consent.checked) err = "Please tick the consent box so we can contact you.";
      if (err) { errEl.textContent = err; errEl.hidden = false; return; }
      if (f.elements.botcheck.checked) return;
      errEl.hidden = true;

      const btn = f.querySelector("[type=submit]");
      btn.disabled = true; btn.textContent = "Creating…";
      const ticket = W.makeTicket();
      const transcript = state.log.map(function (m) { return (m.role === "user" ? "Visitor: " : "Assistant: ") + m.text; }).join("\n\n");
      const fields = {
        subject: "Chatbot Escalation " + ticket + " — " + (state.reason || "query"),
        ticket: ticket, name: v("name"), mobile: v("mobile"), email: v("email"), city: v("city") || "-",
        note: v("note") || "-", escalation_reason: state.reason || "-", consent: "Yes", page: location.href,
        transcript: transcript || "(no messages)"
      };
      let delivered = true;
      try { await W.sendToInbox(fields); } catch (e2) { delivered = false; }
      state.ticket = { id: ticket, delivered: delivered, name: v("name"), fields: delivered ? null : fields };
      state.escalated = false; save();
      f.remove();
      ticketCard(state.ticket, true);
    });
  }

  function ticketCard(t, announce) {
    const old = body.querySelector(".ticket-card"); if (old) old.remove();
    const card = document.createElement("div");
    card.className = "ticket-card";
    const waText = "Hello, my 365 Wealth Management ticket number is " + t.id + ".";
    let html = "<strong>" + (t.delivered ? "Ticket created. Our team will contact you shortly." : "Your ticket number is ready.") + "</strong>" +
      '<div><span class="ticket">' + esc(t.id) + "</span></div>" +
      "<div>Please quote this number in any follow-up." + (t.delivered ? "" : " We couldn't send it automatically, so please tap <strong>Email ticket</strong> or <strong>WhatsApp</strong> to share it with us.") + "</div>" +
      '<div class="btn-row"><button class="btn btn-navy" type="button" data-copy>' + icon("copy") + "Copy</button>";
    if (!t.delivered && t.fields) {
      const bodyTxt = Object.keys(t.fields).map(function (k) { return k + ": " + t.fields[k]; }).join("\n");
      html += '<a class="btn btn-ghost" href="' + W.mailtoLink(t.fields.subject, bodyTxt) + '">' + icon("mail") + "Email ticket</a>";
    }
    html += '<a class="btn btn-ghost" target="_blank" rel="noopener" href="' + W.waLink(waText) + '">' + icon("whatsapp") + 'WhatsApp</a><a class="btn btn-ghost" href="tel:' + C.phone + '">' + icon("phone") + "Call</a></div>";
    card.innerHTML = html;
    body.appendChild(card);
    card.querySelector("[data-copy]").addEventListener("click", function (e) {
      const b = e.currentTarget;
      (navigator.clipboard ? navigator.clipboard.writeText(t.id) : Promise.reject()).then(function () { b.lastChild.textContent = "Copied"; }, function () { b.lastChild.textContent = t.id; });
    });
    if (announce) bubble("bot", "Thank you, " + t.name.split(" ")[0] + ". Your ticket number is " + t.id + ". A member of the 365 Wealth Management team will get back to you.", true);
    scroll();
  }
})();
