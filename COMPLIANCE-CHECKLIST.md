# Pre-launch Compliance Checklist

Verify every item against **current official sources** (SEBI, AMFI, PFRDA, IFSCA, IRDAI, Income-tax Department) before publishing. The site deliberately avoids hard-coded figures that change. Re-check this list whenever regulations change.

## Registration & identity
- [ ] ARN **364547** is valid and current on the AMFI website; the ARN holder name matches "Pankaj Manchanda / 365 Wealth Management".
- [ ] EUIN details, if required for display, are added.
- [ ] Wording consistently states **AMFI Registered Mutual Fund Distributor** and nowhere implies SEBI Registered Investment Adviser or Research Analyst status.
- [ ] Check AMFI's latest **Code of Conduct / advertisement and website guidelines for MFDs**: required disclosures, use of the word "advisor/adviser", logo usage, and the commission disclosure.

## Mutual funds
- [ ] Standard risk statement appears on all product pages and in the footer, exactly as worded: *"Mutual Fund investments are subject to market risks, read all scheme related documents carefully."*
- [ ] Category descriptions (large/mid/small/multi/flexi cap etc.) match SEBI's current scheme categorisation circular.
- [ ] The site shows no scheme names, past returns or performance claims. If any are added later, they must follow SEBI advertisement norms.
- [ ] Portfolio-analysis wording stays within what is permitted for MFDs (incidental to distribution, no separate advisory fee).

## SIF
- [ ] SEBI's current SIF framework: minimum investment, accredited-investor exceptions, permitted strategies, and derivative/short exposure limits.
- [ ] **Distributor eligibility to distribute SIFs** (required NISM certification and AMC empanelment) is in place before offering SIFs.

## NPS
- [ ] Current PFRDA rules for lump-sum withdrawal vs annuity, exit age, partial withdrawals and Tier I/II features.
- [ ] Current tax provisions for NPS contributions, withdrawals and annuity income.
- [ ] Whether 365 Wealth Management is registered as an NPS Point of Presence / agent, or works via one. Adjust wording if needed.
- [ ] Default "annuity portion" and "annuity rate" in the NPS calculator (40% and 6%) are clearly labelled assumptions; update the defaults if rules change.

## PMS / AIF / GIFT City / Unlisted / InvITs & REITs
- [ ] PMS minimum investment and the SEBI Portfolio Managers Regulations references are current; confirm distributor registration/empanelment for PMS.
- [ ] AIF minimum investment, categories and distribution requirements.
- [ ] GIFT City: IFSCA rules, LRS remittance limits and fund eligibility.
- [ ] Unlisted shares: the facilitation model is lawful; copy makes no listing/return promises.
- [ ] InvIT/REIT distribution requirements are described accurately.

## Insurance
- [ ] An IRDAI licence / point-of-sales / corporate-agent arrangement exists before insurance is offered. Otherwise, reword the Insurance section as educational only.
- [ ] IRDAI-mandated disclaimers ("Insurance is the subject matter of solicitation", etc.) are present where required.

## Data protection & communications
- [ ] Privacy Policy reflects actual data practices (Web3Forms, Anthropic Claude API, Netlify) and DPDP Act 2023 obligations.
- [ ] Consent wording on the enquiry form and chatbot escalation is approved.
- [ ] Chatbot system prompt (`netlify/functions/chat.mjs`) reviewed. Test it with tricky questions (return promises, scheme picks, tax advice) before launch.

## Content
- [ ] Founder biography details (qualifications, experience) are factual and verifiable.
- [ ] Office addresses, phone and email are correct.
- [ ] "Last updated" dates on legal pages are set.
