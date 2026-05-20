# chairithinug.com

Source for [**www.chairithinug.com**](https://www.chairithinug.com) — Anapat Chairithinugull's personal portfolio. Static, multilingual (EN · ไทย · DA), PWA-ready, hosted on GitHub Pages.

Built as a **passport-as-portfolio** ("Bangkok Harbor" design system) — every page is a sub-document filed under one passport authority, with bilingual labels, entry stamps marking cities lived in, an interactive five-lane career timeline, and section bands that read like chapters of one bound document.

## Stack

- **Vanilla HTML/CSS/JS** — no framework, no build step. Edit files, push, deploy.
- **IBM Plex** type family (Sans / Sans Thai / Serif / Mono) loaded from Google Fonts.
- **Hand-written `style.css`** (~1,940 lines) — design tokens in `:root`, single source of truth. No Tailwind, no PostCSS.
- **Cache-first service worker** for PWA offline shell.
- **JSON i18n** (`/lang/{en,th,da}.json`) — language switcher swaps `[data-i18n]` text and `[data-i18n-aria-label]` attributes site-wide.
- **GitHub Pages** deploy from `main`, custom domain via `CNAME`, fronted by Cloudflare for CDN + HTTPS.

## Project structure

```
.
├── index.html              # Home — passport identity + timeline + lately + clocks + teasers + contact
├── career.html             # § 02 · timeline + work / education / volunteer
├── projects.html           # § 03 · filterable manifest with year heatmap + tag bars
├── skills.html             # § 04 · technical toolkit + spoken languages + certifications
├── articles.html           # § 05 · archive + reading list
├── faq.html                # § 06 · flip cards
├── privacy.html            # § 07 · privacy policy + WCAG 2.2 AA statement
├── books.html              # § 08 · reading list
├── interests.html          # § 09 · hobbies + sports achievements (with race-progress sparklines)
├── 404.html                # § 404 · not-found
├── template.html           # canonical starting point for new pages
│
├── articles/               # individual blog posts (article-view template)
│
├── style.css               # all styles (design tokens, components, responsive rules)
├── site.js                 # all behavior (timeline SVG, theme, lang switcher, menu, tweaks, scroll-spy, clocks)
├── chrome.js               # injects nav / mobile menu / footer / tweaks + cookie banner + GA loader
├── manifest.webmanifest    # PWA manifest
├── service-worker.js       # offline shell, cache-first
│
├── lang/                   # i18n dictionaries (en, th, da)
├── icons/                  # SVG icons + favicon set
├── img/                    # profile photo (3 responsive sizes) + Open Graph card
├── pdf/                    # resume PDFs
│
├── CNAME                   # custom domain pin (www.chairithinug.com)
├── sitemap.xml             # search-engine sitemap
├── robots.txt              # crawler directives
├── package.json            # devDependencies dropped after Tailwind/PostCSS removal
└── CLAUDE.md               # architecture notes for AI coding assistants
```

## Design system — "Bangkok Harbor"

Two base tones:

- **Harbor Navy** `#0A1626` — body text, headings, dark sections
- **Aged Paper** `#F2EAD8` — default page background

Five named accents, used intentionally:

- **Monk's Saffron** `#D97E3D` — default accent, personality moments
- **Copenhagen Sky** `#346094` — institutional / technical
- **Tea Jade** `#5A8270` — build / status-good
- **Thai Chili** `#A8342E` — NOW marker, heat
- **Vintage Gold** `#C29A47` — special stamps

Three tinted section backgrounds (`.section-block.warm`, `.alt`, `.deep`) give the page rhythm; `.section-block.ink` flips to Harbor Navy with paper text.

Every secondary page hero carries a **passport seal** in the top-right corner (C · Annex II, P · Manifest, S · Inventory, W · Field Notes, Q · Q&A, etc.) and a **bilingual subtitle** below the H1.

## Development

```bash
# Static site, no build. Just serve.
python -m http.server
# or
npx serve .
```

Open `http://localhost:8000/`. Hard-refresh (Cmd-Shift-R) if the service worker serves a stale shell.

### Adding a new article

1. Copy `articles/cycling-in-denmark-how-to-ride-like-a-dane.html` as a starting point.
2. Replace title, canonical URL, dates, JSON-LD `BlogPosting`, `<article class="article-view">` body, and the tag chips.
3. Body content goes in `<div class="prose body">…</div>`. Optional `<section class="tldr">` callout at the top.
4. Author byline `<footer class="post-byline">` stays as-is.
5. Add entry on `articles.html` and `sitemap.xml`.
6. Bump `service-worker.js` cache version and add the article path to `urlsToCache`.

### Adding a new page

Copy `template.html`, fill in placeholders, add to `chrome.js` `PAGES` if it should appear in nav, add to `sitemap.xml`, bump SW cache.

## Architecture notes

### Chrome injection

Each page declares four placeholders that `chrome.js` fills in at runtime:

```html
<body data-page="career">
  <header class="nav" data-chrome="nav"></header>
  <aside class="menu-sheet" data-chrome="menu"></aside>
  <main id="main">…page content…</main>
  <footer class="slim-footer" data-chrome="footer"></footer>
  <aside class="tweaks" data-chrome="tweaks"></aside>
  <script src="/chrome.js"></script>
  <script src="/site.js"></script>
</body>
```

`chrome.js` reads `body.dataset.page` to mark the active nav link. The home page uses a full `.contact` block instead of `.slim-footer`.

### Behavior (`site.js`)

One global script. Handles:

- SVG career timeline render with greedy sub-row scheduling for overlapping entries
- Theme toggle with `localStorage.theme` + system preference default
- Language switcher (`/lang/{en,th,da}.json` fetched, applied via `[data-i18n]` / `[data-i18n-aria-label]`)
- Mobile menu sheet (slide-up modal with focus management + Escape) — also hosts the language switch on mobile
- Tweaks panel (accent / theme / bilingual mode / background: guilloché · grain · grid · flat)
- Scroll-spy on nav links
- FAQ flip-card toggling with `aria-expanded` + answer-on-flip
- Dual-city clocks (Bangkok / Copenhagen) via `Intl.DateTimeFormat`, with `<time datetime>` synced each tick
- Project filter chips
- Skill-tile a11y enrichment — appends sr-only "Fluent / Comfortable / Learning" labels per tile
- External-link a11y enrichment — appends "(opens in new tab)" to every `target="_blank"` aria-label

Each init is isolated in a try/catch so a single failure can't sink the rest of the page.

### Cookie consent + analytics

`chrome.js` injects a GDPR/PDPA-compliant banner with focus trap. Google Analytics 4 (`G-FJQNSE4GQC`) loads **only** after explicit Accept; Reject blocks it entirely. Consent persists in `localStorage.cookieConsent`.

### Service worker

`service-worker.js` caches a fixed shell with `CACHE_NAME = 'pwa-cache-vNN'`. **Bump the version whenever a file in `urlsToCache` changes, is added, or is removed** — otherwise returning visitors keep the stale cache.

Strategy: network-first for navigations (with offline fallback to `/404.html`), cache-first for everything else.

### Dark-mode flash prevention

Each page has a tiny inline `<script>` in `<head>` (before the stylesheet) that reads `localStorage.theme` and sets `document.documentElement.dataset.theme` synchronously. **This must stay inline and must run before any CSS loads** — moving it to a `defer`-ed file causes a flash of the wrong theme. The CSP allows it via a SHA-256 hash (`script-src 'self' 'sha256-…'`).

## Security

- **Content Security Policy** on every page (meta http-equiv): `script-src` restricted to `'self'`, GTM, and the FOUC-guard hash. `style-src` allows `'unsafe-inline'` for component-level inline styles and Google Fonts. `connect-src` allows GA4 regional collectors.
- **Subresource Integrity**: not used on Google Fonts CSS (varies per UA).
- **No third-party trackers** beyond opt-in GA4. No GTM container.
- See `/privacy.html` for the full data-collection statement.

## Accessibility

Targets **WCAG 2.2 Level AA**:

- Skip-to-content link on every page, semantic landmarks, single H1
- Keyboard navigation throughout; visible `:focus-visible` outlines using `--accent`
- Color contrast: `--saffron-text` / `--gold-text` / `--jade-text` darkened variants for body-size text (≥ 4.5:1 on `--paper`)
- `prefers-reduced-motion` respected in animations
- Modal dialogs (cookie banner, mobile menu) have proper `role="dialog"`, `aria-modal`, focus trap, and Escape
- FAQ flip cards manage `aria-expanded` + announce answer on flip
- Timeline SVG is `aria-hidden`; the canonical AT representation is the `<ol class="tl-mobile">` (visible on mobile, sr-only on desktop) so screen readers get one coherent narrative
- Skill-tile proficiency and external-link "(opens in new tab)" hints are injected at runtime by `site.js`
- Project heatmap + tag bars carry per-`<li>` aria-labels so the visual chart has a text equivalent

## Page numbering

Each top-level page has a `§ NN` identifier in its hero eyebrow:

| § | Page |
|---|---|
| § 01 | Home |
| § 02 | Career |
| § 03 | Projects |
| § 04 | Skills |
| § 05 | Writing (Articles) |
| § 06 | FAQ |
| § 07 | Privacy |
| § 08 | Books |
| § 09 | Interests |
| § 404 | Not found |

Inner sections use `§ NN.MM` (e.g. Career has §02.01 Timeline, §02.02 Work, §02.03 Education, §02.04 Volunteer).

## Deployment

GitHub Pages auto-deploys from `main`. Push to publish.

```bash
git push origin main
```

No CI workflow needed. Production URL is `https://www.chairithinug.com`, fronted by Cloudflare.

## Credits

- **Design system** "Bangkok Harbor" — created via Claude Design, refined through several iterations.
- **Type** — IBM Plex family (SIL Open Font License).
- **AI assistance** — Claude Code throughout the redesign.
