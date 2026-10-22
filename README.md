# 365 Wealth Management — Website

Static, responsive website for **365 Wealth Management** (AMFI Registered Mutual Fund Distributor, ARN 364547). It includes a Claude-powered chat assistant with human escalation and ticketing.

```
index.html              Home
about.html              About + founder + "Our Role" (MFD vs RIA)
solutions.html          All solutions + PMS / AIF / GIFT City / Unlisted / InvITs & REITs / Insurance
mutual-funds.html       Categories + portfolio-construction universe
sip.html                SIP explainer + SIP calculator (with step-up)
sif.html                Specialized Investment Funds
nps-retirement.html     Retirement strategy, NPS, NPS calculator, income buckets
portfolio-analysis.html Review | Allocate | Grow
education.html          Investor Education Centre (cards from assets/data/articles.json)
article.html            Article template (?slug=…)
calculators.html        8 calculators (tabs; deep-link with #sip, #nps, #swp, #goal …)
contact.html            Offices, quick actions, enquiry form
privacy.html terms.html disclaimer.html
logo-preview.html       Brand sheet showing all logo variants (optional; can be deleted before launch)

assets/css/styles.css   Design system (colours, type, components, responsive)
assets/js/config.js     ← EDIT: phone, email, WhatsApp, Web3Forms key
assets/js/main.js       Shared header/footer/nav, icons, animations, enquiry form, ticket numbers
assets/js/calculators.js Calculator maths + UI (Chart.js charts)
assets/js/chatbot.js    "365 Assistant" chat widget + escalation form
assets/js/education.js  Education centre + article rendering
assets/data/articles.json 21 education topics (add a YouTube ID to turn a card into a video)
assets/img/logo/        Logo SVGs (horizontal, stacked, mark, white), favicon, PNG icons, OG image
netlify/functions/chat.mjs Server-side proxy to the Claude API (keeps the API key secret)
tests/calculators.test.mjs Calculator maths tests (npm test)
COMPLIANCE-CHECKLIST.md Items to verify before going live
```

## 1. Setup checklist

1. **Web3Forms key** (free): go to <https://web3forms.com>, create an access key using **mrpankajmanchanda@gmail.com**, and paste it into `assets/js/config.js` → `web3formsKey`. Enquiries and chatbot escalations (with ticket number and chat transcript) are delivered to that inbox.
   *Until the key is set, forms still show the ticket number and offer pre-filled Email/WhatsApp links instead.*
2. **Anthropic API key**: create one at <https://console.anthropic.com>. Do **not** put it in any file. Add it in Netlify as an environment variable (step 3).
3. **Deploy on Netlify**
   - Push this folder to a Git repo (GitHub/GitLab) and choose *Add new site → Import from Git* in Netlify. Build command: *(none)*; publish directory: `.` (already set in `netlify.toml`).
   - *Site settings → Environment variables*: add `ANTHROPIC_API_KEY`.
   - Optional: `CLAUDE_MODEL` (default `claude-haiku-5-5`, which is fast and low-cost).
   - Connect your domain under *Domain management*.
4. **Founder photo**: replace the placeholder in `about.html` and `index.html` (search for "Founder photograph") with `assets/img/pankaj-manchanda.jpg`.
5. **YouTube**: add `youtubeId` values in `assets/data/articles.json` to embed videos; set `youtubeChannel` in `config.js`.
6. Work through **`COMPLIANCE-CHECKLIST.md`** before publishing.

## 2. Local development

```bash
npm install
npx netlify-cli dev          # serves the site + chat function at http://localhost:8888
# needs ANTHROPIC_API_KEY in your shell or a local .env file (git-ignored)
npm test                     # calculator maths tests
```

You can also preview the site with any static server (`python3 -m http.server`). Without the function, the chatbot automatically switches to the "connect with our team" ticket flow.

## 3. How the chatbot works

- Visitor questions go to `/.netlify/functions/chat`, which calls Claude with a system prompt holding the firm's facts and compliance rules. The rules are: education only, no return promises, no scheme recommendations, no hard-coded regulatory numbers, and the firm is described as an MFD, not an RIA.
- Claude returns structured JSON `{ reply, escalate, reason }`. The widget escalates when:
  - the model sets `escalate`
  - the visitor asks for a human
  - the API is unavailable
  - the session exceeds 30 messages
- **Escalation flow:**
  1. The visitor gives name, mobile, email, city and a note, and ticks the consent box.
  2. A ticket like `365-261021-K7QX` is generated.
  3. The ticket and full transcript are emailed via Web3Forms.
  4. The visitor sees the ticket number with Copy, WhatsApp and Call buttons.
- The conversation persists across pages within the browser session (sessionStorage).

## 4. Editing content

- **Contact details:** `assets/js/config.js` (also hard-coded in page copy and the chatbot system prompt in `netlify/functions/chat.mjs`; search for the phone number to update all).
- **Navigation, footer, disclaimer text:** `assets/js/main.js` (`NAV`, `SOLUTIONS`, `renderFooter`).
- **Articles:** `assets/data/articles.json`.
- **Logo:** SVG files in `assets/img/logo/`; text is converted to outlines, so they render identically everywhere.
