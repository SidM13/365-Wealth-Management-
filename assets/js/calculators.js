/* 365 Wealth Management — financial calculators (illustrative only) */
(function () {
  "use strict";

  const NOTE = "Illustrative calculation only. Actual investment returns may vary and are not guaranteed.";

  /* ---------- Formatting ---------- */
  const fmtFull = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
  function inr(n) {
    if (!isFinite(n)) return "—";
    const a = Math.abs(n), s = n < 0 ? "-" : "";
    if (a >= 1e7) return s + "₹" + (a / 1e7).toFixed(2) + " Cr";
    if (a >= 1e5) return s + "₹" + (a / 1e5).toFixed(2) + " L";
    return s + "₹" + fmtFull.format(a);
  }
  function inrFull(n) { return "₹" + fmtFull.format(Math.round(n)); }

  /* ---------- Pure maths (exported for testing) ---------- */
  const M = {
    // Monthly SIP, investment at start of each month, monthly compounding at annual/12.
    sip: function (P, ratePct, years) {
      const i = ratePct / 1200, n = Math.round(years * 12);
      const fv = i === 0 ? P * n : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      return { invested: P * n, fv: fv };
    },
    // SIP with annual step-up; returns yearly rows.
    stepUp: function (P, stepPct, ratePct, years) {
      const i = ratePct / 1200; let bal = 0, inv = 0, amt = P; const rows = [];
      for (let y = 1; y <= years; y++) {
        for (let m = 0; m < 12; m++) { bal = (bal + amt) * (1 + i); inv += amt; }
        rows.push({ year: y, monthly: amt, invested: inv, value: bal });
        amt = amt * (1 + stepPct / 100);
      }
      return { invested: inv, fv: bal, rows: rows };
    },
    lumpsum: function (P, ratePct, years) { return P * Math.pow(1 + ratePct / 100, years); },
    // Monthly SIP needed to reach target (annuity-due).
    sipFor: function (target, ratePct, years) {
      const i = ratePct / 1200, n = Math.round(years * 12);
      if (target <= 0) return 0;
      return i === 0 ? target / n : target / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));
    },
    // Corpus needed at retirement for inflation-rising annual expense E over m years, withdrawn at start of year.
    corpusNeeded: function (E, inflPct, postPct, m) {
      const g = inflPct / 100, r = postPct / 100;
      if (Math.abs(r - g) < 1e-9) return E * m;
      return E * (1 - Math.pow((1 + g) / (1 + r), m)) / (r - g) * (1 + r);
    },
    swp: function (corpus, w, ratePct, years) {
      const i = ratePct / 1200; let bal = corpus, total = 0, depleted = null; const rows = [];
      for (let mth = 1; mth <= years * 12; mth++) {
        const take = Math.min(w, bal);
        bal -= take; total += take;
        bal *= 1 + i;
        if (bal <= 0.5 && depleted === null) { depleted = mth; bal = 0; }
        if (mth % 12 === 0) rows.push({ year: mth / 12, withdrawn: total, balance: bal });
      }
      return { total: total, balance: bal, depleted: depleted, rows: rows };
    }
  };
  window.W365Calc = M;

  /* ---------- Calculator definitions ---------- */
  // field: [key, label, min, max, step, default, unit, hint]
  const DEFS = {
    sip: {
      title: "SIP Calculator",
      fields: [["amt", "Monthly SIP Amount", 500, 500000, 500, 10000, "₹"], ["rate", "Expected Annual Return", 1, 30, 0.5, 12, "%"], ["yrs", "Investment Period", 1, 40, 1, 15, "yrs"]],
      run: function (v) {
        const rows = [];
        for (let y = 1; y <= v.yrs; y++) { const r = M.sip(v.amt, v.rate, y); rows.push({ year: y, invested: r.invested, value: r.fv }); }
        const r = M.sip(v.amt, v.rate, v.yrs);
        return { results: [["Total Amount Invested", r.invested], ["Estimated Future Value", r.fv, 1], ["Estimated Wealth Gain", r.fv - r.invested]], line: { labels: rows.map(function (x) { return "Yr " + x.year; }), sets: [["Estimated value", rows.map(function (x) { return x.value; })], ["Amount invested", rows.map(function (x) { return x.invested; })]] } };
      }
    },
    stepup: {
      title: "SIP Calculator with Annual Step-Up",
      fields: [["amt", "Monthly SIP Amount", 500, 500000, 500, 10000, "₹"], ["rate", "Expected Annual Return", 1, 30, 0.5, 12, "%"], ["yrs", "Investment Period", 1, 40, 1, 15, "yrs"], ["step", "Annual SIP Step-Up", 0, 50, 1, 10, "%", "Increase your SIP each year as income grows. Set 0 for a regular SIP."]],
      run: function (v) {
        const r = M.stepUp(v.amt, v.step, v.rate, v.yrs);
        return {
          results: [["Total Amount Invested", r.invested], ["Estimated Future Value", r.fv, 1], ["Estimated Wealth Gain", r.fv - r.invested]],
          line: { labels: r.rows.map(function (x) { return "Yr " + x.year; }), sets: [["Estimated value", r.rows.map(function (x) { return x.value; })], ["Amount invested", r.rows.map(function (x) { return x.invested; })]] },
          table: { head: ["Year", "Monthly SIP", "Invested", "Est. Value"], rows: r.rows.map(function (x) { return [x.year, inrFull(x.monthly), inr(x.invested), inr(x.value)]; }) }
        };
      }
    },
    lumpsum: {
      title: "Lump-Sum Investment Calculator",
      fields: [["amt", "One-time Investment", 10000, 50000000, 10000, 500000, "₹"], ["rate", "Expected Annual Return", 1, 30, 0.5, 10, "%"], ["yrs", "Investment Period", 1, 40, 1, 10, "yrs"]],
      run: function (v) {
        const fv = M.lumpsum(v.amt, v.rate, v.yrs), lab = [], val = [], inv = [];
        for (let y = 0; y <= v.yrs; y++) { lab.push("Yr " + y); val.push(M.lumpsum(v.amt, v.rate, y)); inv.push(v.amt); }
        return { results: [["Amount Invested", v.amt], ["Estimated Future Value", fv, 1], ["Estimated Wealth Gain", fv - v.amt]], line: { labels: lab, sets: [["Estimated value", val], ["Amount invested", inv]] } };
      }
    },
    retirement: {
      title: "Retirement Corpus Calculator",
      fields: [["age", "Current Age", 18, 65, 1, 30, "yrs"], ["ret", "Retirement Age", 40, 75, 1, 60, "yrs"], ["life", "Life Expectancy (planning age)", 60, 100, 1, 85, "yrs"], ["exp", "Current Monthly Household Expense", 5000, 1000000, 1000, 50000, "₹"], ["infl", "Expected Inflation", 0, 12, 0.5, 6, "%"], ["pre", "Expected Return Before Retirement", 1, 20, 0.5, 11, "%"], ["post", "Expected Return After Retirement", 1, 15, 0.5, 7, "%"], ["have", "Existing Retirement Savings", 0, 100000000, 10000, 0, "₹"]],
      run: function (v) {
        const n = Math.max(0, v.ret - v.age), m = Math.max(1, v.life - v.ret);
        const E = v.exp * 12 * Math.pow(1 + v.infl / 100, n);
        const need = M.corpusNeeded(E, v.infl, v.post, m);
        const haveFV = M.lumpsum(v.have, v.pre, n);
        const sip = n > 0 ? M.sipFor(need - haveFV, v.pre, n) : 0;
        // path: accumulate with SIP, then draw down
        const lab = [], bal = []; let b = v.have, i = v.pre / 1200;
        for (let y = v.age; y < v.ret; y++) { for (let k = 0; k < 12; k++) b = (b + sip) * (1 + i); lab.push(y + 1); bal.push(b); }
        let e = E; const r2 = v.post / 100;
        for (let y = v.ret; y < v.life; y++) { b = (b - e) * (1 + r2); e *= 1 + v.infl / 100; lab.push(y + 1); bal.push(Math.max(0, b)); }
        return {
          results: [["Monthly Expense at Retirement", E / 12], ["Retirement Corpus Required", need, 1], ["Monthly SIP Needed (approx.)", Math.max(0, sip)]],
          extra: need - haveFV <= 0 ? '<div class="gap-msg ok">Your existing savings, if they grow at the assumed rate, may cover the estimated corpus.</div>' : "",
          line: { labels: lab.map(function (a) { return "Age " + a; }), sets: [["Projected corpus", bal]] }
        };
      }
    },
    nps: {
      title: "NPS Retirement Calculator",
      fields: [["age", "Current Age", 18, 70, 1, 30, "yrs"], ["ret", "Retirement Age", 40, 75, 1, 60, "yrs"], ["have", "Current NPS Corpus", 0, 50000000, 10000, 0, "₹"], ["amt", "Monthly Contribution", 500, 500000, 500, 5000, "₹"], ["inc", "Expected Annual Contribution Increase", 0, 20, 1, 5, "%"], ["rate", "Expected Return (blended equity/debt)", 4, 14, 0.5, 10, "%"], ["ann", "Assumed Annuity Portion of Corpus", 0, 100, 5, 40, "%", "Assumption only. The minimum annuity purchase and lump-sum withdrawal limits are set by PFRDA and may change. Check current rules before deciding."], ["annRate", "Assumed Annuity Rate", 3, 10, 0.25, 6, "%"], ["want", "Desired Monthly Retirement Income (today's value)", 5000, 1000000, 1000, 50000, "₹"], ["infl", "Expected Inflation", 0, 12, 0.5, 6, "%"]],
      run: function (v) {
        const n = Math.max(0, v.ret - v.age), i = v.rate / 1200;
        let bal = v.have, amt = v.amt, contrib = 0; const lab = [], vals = [], inv = [];
        for (let y = 1; y <= n; y++) {
          for (let k = 0; k < 12; k++) { bal = (bal + amt) * (1 + i); contrib += amt; }
          lab.push("Age " + (v.age + y)); vals.push(bal); inv.push(contrib + v.have);
          amt *= 1 + v.inc / 100;
        }
        const annuity = bal * v.ann / 100, lump = bal - annuity;
        const pension = annuity * v.annRate / 100 / 12;
        const want = v.want * Math.pow(1 + v.infl / 100, n);
        const gap = want - pension;
        const extra = '<div class="gap-msg ' + (gap > 0 ? "short" : "ok") + '">Desired income at retirement (inflation-adjusted): <strong>' + inrFull(want) + "/month</strong>. " +
          (gap > 0 ? "Estimated annuity income may fall short by about <strong>" + inrFull(gap) + "/month</strong>. The lump-sum portion, mutual funds, SWPs and other assets could help bridge this. See the retirement-income buckets below." : "Estimated annuity income may meet the desired level under these assumptions.") + "</div>";
        return {
          results: [["Total Contribution", contrib + v.have], ["Estimated Corpus at Retirement", bal, 1], ["Est. Monthly Annuity Income", pension], ["Lump-sum Portion", lump], ["Annuity Purchase", annuity], ["Years to Retirement", n, 0, "yrs"]],
          extra: extra,
          line: { labels: lab, sets: [["Estimated corpus", vals], ["Contributions", inv]] }
        };
      }
    },
    swp: {
      title: "SWP Calculator",
      fields: [["corpus", "Total Investment", 100000, 100000000, 50000, 5000000, "₹"], ["w", "Monthly Withdrawal", 1000, 1000000, 1000, 30000, "₹"], ["rate", "Expected Annual Return", 0, 15, 0.5, 8, "%"], ["yrs", "Withdrawal Period", 1, 40, 1, 20, "yrs"]],
      run: function (v) {
        const r = M.swp(v.corpus, v.w, v.rate, v.yrs);
        const extra = r.depleted ? '<div class="gap-msg short">At these assumptions the corpus is exhausted in about <strong>' + Math.floor(r.depleted / 12) + " years " + (r.depleted % 12) + " months</strong>.</div>" : '<div class="gap-msg ok">At these assumptions the corpus lasts the full ' + v.yrs + "-year period.</div>";
        return {
          results: [["Total Investment", v.corpus], ["Total Withdrawn", r.total], ["Estimated Final Balance", r.balance, 1]], extra: extra,
          line: { labels: r.rows.map(function (x) { return "Yr " + x.year; }), sets: [["Remaining balance", r.rows.map(function (x) { return x.balance; })], ["Cumulative withdrawals", r.rows.map(function (x) { return x.withdrawn; })]] },
          table: { head: ["Year", "Withdrawn (cum.)", "Balance"], rows: r.rows.map(function (x) { return [x.year, inr(x.withdrawn), inr(x.balance)]; }) }
        };
      }
    },
    fv: {
      title: "Future Value Calculator",
      fields: [["amt", "Present Value", 1000, 100000000, 1000, 100000, "₹"], ["rate", "Annual Growth / Inflation Rate", 0, 20, 0.5, 6, "%", "Use an inflation rate to see what today's cost may become, or a return rate to project growth."], ["yrs", "Number of Years", 1, 50, 1, 10, "yrs"]],
      run: function (v) {
        const fv = M.lumpsum(v.amt, v.rate, v.yrs), lab = [], val = [];
        for (let y = 0; y <= v.yrs; y++) { lab.push("Yr " + y); val.push(M.lumpsum(v.amt, v.rate, y)); }
        return { results: [["Present Value", v.amt], ["Estimated Future Value", fv, 1], ["Growth Multiple", fv / v.amt, 0, "×"]], line: { labels: lab, sets: [["Future value", val]] } };
      }
    },
    goal: {
      title: "Goal Planning Calculator",
      fields: [["cost", "Cost of Goal Today", 10000, 100000000, 10000, 2000000, "₹"], ["yrs", "Years to Goal", 1, 40, 1, 10, "yrs"], ["infl", "Expected Inflation", 0, 15, 0.5, 6, "%"], ["rate", "Expected Annual Return", 1, 20, 0.5, 10, "%"], ["have", "Existing Savings for this Goal", 0, 100000000, 10000, 0, "₹"]],
      run: function (v) {
        const target = M.lumpsum(v.cost, v.infl, v.yrs);
        const haveFV = M.lumpsum(v.have, v.rate, v.yrs);
        const gap = Math.max(0, target - haveFV);
        const sip = M.sipFor(gap, v.rate, v.yrs);
        const lump = gap / Math.pow(1 + v.rate / 100, v.yrs);
        const lab = [], tgt = [], path = [];
        for (let y = 0; y <= v.yrs; y++) { lab.push("Yr " + y); tgt.push(target); path.push(M.lumpsum(v.have, v.rate, y) + (y ? M.sip(sip, v.rate, y).fv : 0)); }
        return { results: [["Future Cost of Goal", target], ["Monthly SIP Required", sip, 1], ["Or Lump-sum Required Today", lump]], line: { labels: lab, sets: [["Projected savings", path], ["Goal amount", tgt]] } };
      }
    }
  };

  /* ---------- UI ---------- */
  const COLORS = ["#C9A24B", "#1F6B52", "#0B1F3A"];
  function fieldHTML(id, f) {
    const pre = f[6] === "₹" ? "<span>₹</span>" : "";
    const suf = f[6] !== "₹" ? "<span>" + f[6] + "</span>" : "";
    return '<div class="field-range"><label for="' + id + '-' + f[0] + '">' + f[1] + '<span class="val">' + pre + '<input type="number" inputmode="decimal" id="' + id + '-' + f[0] + '" data-k="' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '" value="' + f[5] + '">' + suf + "</span></label>" +
      '<input type="range" data-r="' + f[0] + '" min="' + f[2] + '" max="' + f[3] + '" step="' + f[4] + '" value="' + f[5] + '" aria-label="' + f[1] + '">' + (f[7] ? '<div class="hint">' + f[7] + "</div>" : "") + "</div>";
  }
  function setFill(r) { r.style.setProperty("--p", ((r.value - r.min) / (r.max - r.min)) * 100 + "%"); }

  let uid = 0;
  function build(el) {
    const key = el.dataset.calc, def = DEFS[key];
    if (!def) return;
    const id = "c" + (++uid);
    el.innerHTML =
      '<div class="calc-inputs"><h3>' + (el.dataset.title || def.title) + "</h3>" + def.fields.map(function (f) { return fieldHTML(id, f); }).join("") + "</div>" +
      '<div class="calc-output"><div class="results"></div><div class="calc-extra"></div><div class="chart-box"><canvas aria-label="Projection chart" role="img"></canvas></div><div class="calc-tbl"></div>' +
      '<div class="illus-note" role="note">' + window.W365.icon("alert") + "<span>" + NOTE + "</span></div></div>";
    const vals = {};
    def.fields.forEach(function (f) { vals[f[0]] = f[5]; });
    let chart = null;

    function render() {
      const out = def.run(vals);
      el.querySelector(".results").innerHTML = out.results.map(function (r) {
        const v = r[3] ? (r[3] === "×" ? r[1].toFixed(2) + "×" : Math.round(r[1]) + " " + r[3]) : inr(r[1]);
        return '<div class="result' + (r[2] ? " hl" : "") + '"><span>' + r[0] + '</span><strong class="num" title="' + (r[3] ? "" : inrFull(r[1])) + '">' + v + "</strong></div>";
      }).join("");
      el.querySelector(".calc-extra").innerHTML = out.extra || "";
      el.querySelector(".calc-tbl").innerHTML = out.table ? '<details class="more"><summary>Year-wise breakdown</summary><div class="table-scroll" style="margin-top:10px"><table class="calc-table"><thead><tr>' + out.table.head.map(function (h) { return "<th>" + h + "</th>"; }).join("") + "</tr></thead><tbody>" + out.table.rows.map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + c + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div></details>" : "";
      drawChart(out.line);
    }
    function drawChart(line) {
      const box = el.querySelector(".chart-box");
      if (!window.Chart || !line) { box.style.display = "none"; return; }
      const data = {
        labels: line.labels,
        datasets: line.sets.map(function (s, i) {
          return { label: s[0], data: s[1], borderColor: COLORS[i], backgroundColor: i === 0 ? "rgba(201,162,75,.16)" : "rgba(31,107,82,.06)", fill: i === 0 ? "origin" : false, borderWidth: i === 0 ? 2.5 : 2, borderDash: i === 0 ? [] : [6, 5], pointRadius: 0, pointHoverRadius: 4, tension: .3 };
        })
      };
      if (chart) { chart.data = data; chart.update("none"); return; }
      chart = new Chart(el.querySelector("canvas"), {
        type: "line", data: data,
        options: {
          responsive: true, maintainAspectRatio: false, interaction: { mode: "index", intersect: false },
          plugins: { legend: { position: "bottom", labels: { usePointStyle: true, boxWidth: 8, font: { family: "Inter", size: 12 }, color: "#5E6878" } }, tooltip: { callbacks: { label: function (c) { return c.dataset.label + ": " + inr(c.parsed.y); } } } },
          scales: {
            x: { grid: { display: false }, ticks: { maxTicksLimit: 8, font: { family: "Inter", size: 11 }, color: "#5E6878" } },
            y: { grid: { color: "#EFEAE0" }, border: { display: false }, ticks: { callback: function (v) { return inr(v); }, font: { family: "Inter", size: 11 }, color: "#5E6878", maxTicksLimit: 6 } }
          }
        }
      });
    }

    el.addEventListener("input", function (e) {
      const t = e.target, k = t.dataset.k || t.dataset.r;
      if (!k) return;
      let v = parseFloat(t.value);
      if (isNaN(v)) return;
      if (t.dataset.r) {
        el.querySelector('[data-k="' + k + '"]').value = v; setFill(t);
      } else {
        const r = el.querySelector('[data-r="' + k + '"]');
        r.value = Math.min(Math.max(v, +r.min), +r.max); setFill(r);
        v = Math.min(Math.max(v, +t.min), +t.max);
      }
      vals[k] = v;
      // keep dependent ages sensible
      if (vals.age !== undefined && vals.ret !== undefined && vals.ret <= vals.age) vals.ret = vals.age + 1;
      if (vals.life !== undefined && vals.life <= vals.ret) vals.life = vals.ret + 1;
      render();
    });
    el.addEventListener("change", function (e) {
      const t = e.target;
      if (t.dataset.k) { const v = Math.min(Math.max(parseFloat(t.value) || +t.min, +t.min), +t.max); t.value = v; vals[t.dataset.k] = v; render(); }
    });
    el.querySelectorAll("input[type=range]").forEach(setFill);
    render();
  }

  function initTabs() {
    const tabs = document.querySelector(".calc-tabs");
    if (!tabs) return;
    const btns = tabs.querySelectorAll("button");
    function show(key, push) {
      btns.forEach(function (b) {
        const on = b.dataset.tab === key;
        b.setAttribute("aria-selected", on);
        b.tabIndex = on ? 0 : -1;
        document.getElementById("panel-" + b.dataset.tab).hidden = !on;
      });
      if (push) history.replaceState(null, "", "#" + key);
    }
    btns.forEach(function (b) { b.addEventListener("click", function () { show(b.dataset.tab, true); }); });
    tabs.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      const arr = Array.from(btns), i = arr.indexOf(document.activeElement);
      const n = arr[(i + (e.key === "ArrowRight" ? 1 : -1) + arr.length) % arr.length];
      n.focus(); n.click();
    });
    const h = location.hash.slice(1);
    show(document.getElementById("panel-" + h) ? h : btns[0].dataset.tab, false);
  }

  document.querySelectorAll("[data-calc]").forEach(build);
  initTabs();
})();
