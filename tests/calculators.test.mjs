// Run: npm test — checks calculator maths against hand-computed values.
import { readFileSync } from "node:fs";
import vm from "node:vm";
import assert from "node:assert/strict";

const src = readFileSync(new URL("../assets/js/calculators.js", import.meta.url), "utf8");
const window = { W365: { icon: () => "" } };
const ctx = { window, document: { querySelectorAll: () => [], querySelector: () => null }, Intl, Math, history: {}, location: { hash: "" } };
vm.runInNewContext(src, ctx);
const M = window.W365Calc;

const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: got ${a}, expected ${b} ±${tol}`);

// SIP ₹10,000/month, 12%, 10 yrs → invested 12,00,000; FV ≈ 23,23,391
let r = M.sip(10000, 12, 10);
assert.equal(r.invested, 1200000);
near(r.fv, 2323391, 2, "SIP FV");

// Step-up with 0% equals plain SIP
near(M.stepUp(10000, 0, 12, 10).fv, r.fv, 1, "Step-up 0% = SIP");
// Step-up 10%, 15 yrs → invested = 1,20,000 × Σ1.1^k (k=0..14) ≈ 38,12,698
near(M.stepUp(10000, 10, 12, 15).invested, 120000 * ((Math.pow(1.1, 15) - 1) / 0.1), 1, "Step-up invested");

// Lump sum ₹1,00,000 at 10% for 20 yrs ≈ 6,72,750
near(M.lumpsum(100000, 10, 20), 672750, 1, "Lump sum");

// sipFor is the inverse of sip
near(M.sip(M.sipFor(5000000, 10, 15), 10, 15).fv, 5000000, 1, "sipFor inverse");

// Corpus with post-return == inflation is simply E × years
near(M.corpusNeeded(600000, 6, 6, 25), 600000 * 25, 1, "Corpus real-rate 0");

// SWP: 0% return, ₹50,000/month from ₹30,00,000 depletes in exactly 60 months
let s = M.swp(3000000, 50000, 0, 10);
assert.equal(s.depleted, 60);
near(s.total, 3000000, 1, "SWP total");
// SWP that never depletes
s = M.swp(5000000, 20000, 8, 20);
assert.equal(s.depleted, null);

console.log("All calculator tests passed ✓");
