# Maintaining chairithinug.com

A practical handbook for keeping the site current — adding projects, articles, FAQ entries, skills, timeline events, etc. Each section is a recipe with exact file paths.

> Before any change: run `python -m http.server` and hard-refresh (Cmd-Shift-R) to verify your edit looks right locally.
> After any change: **bump the service-worker cache version** (see [§Service worker](#service-worker)) so returning visitors don't see stale content.

---

## Where things live

| What | File(s) |
|---|---|
| Nav, mobile menu (incl. lang switch), footer, cookie banner, GA loader | `chrome.js` |
| Timeline data (career chapters) | `site.js` — `TIMELINE` const (≈ line 12) |
| City bands (timeline background) | `site.js` — `BANDS` const (≈ line 35); colors/opacity in `style.css` `:root` (`--band-bangkok`, `--band-madison`, `--band-copenhagen`, `--tl-band-opacity`, `--tl-pill-bg-opacity`) — swapped per theme |
| Background pattern (guilloché) | `style.css` `:root` — `--bg-pattern` (dark strokes) / `--bg-pattern-light` (light strokes). Applied to `body::after` + section-local `::after` on colored panels |
| Translations (3 languages) | `lang/en.json`, `lang/th.json`, `lang/da.json` |
| All visual styles | `style.css` (single file, ~1900 lines, organized by `/* ───── SECTION ─────*/` banners) |
| All interactive behavior | `site.js` (timeline render, theme, lang, menu, tweaks, scroll-spy, clocks) |
| PWA cache list | `service-worker.js` — `urlsToCache` array |
| Sitemap | `sitemap.xml` |
| robots / SEO bot directives | `robots.txt` |
| Person schema (single source for all JSON-LD `@id` refs) | `index.html` (`<script type="application/ld+json">`) |
| Custom domain pin | `CNAME` |

When in doubt, `grep -rn "thing you want to change"` from repo root — the codebase is small and grep-friendly.

---

## Add a new article

**1.** Copy an existing article as a starting point — `articles/reflections-on-ai-and-coding.html` is the canonical pattern.

```bash
cp articles/reflections-on-ai-and-coding.html articles/your-slug.html
```

**2.** In the new file, update:

- `<title>` (line ~14)
- `<link rel="canonical">` (line ~15) — `https://chairithinug.com/articles/your-slug.html`
- `<meta name="description">` (line ~16)
- `<meta property="og:title">`, `og:url`, `og:description` (lines ~51–60)
- `<meta name="twitter:*">` (lines ~62–65)
- The `<script type="application/ld+json">` `BlogPosting` block (lines ~67–80) — `headline`, `description`, `keywords`, `datePublished`, `dateModified`, `mainEntityOfPage.@id`, `image`
- `<nav class="crumbs">` breadcrumb final span (line ~88)
- `<h1>` and the `.tags` chips (lines ~92, 100–102)
- The `.post-meta` `<time>` and `#reading-time` (lines ~94–95)
- The `.tldr` callout — keep or delete; remove the whole `<section class="tldr">` if not needed
- The `<div class="prose body">…</div>` — your actual content. Use `<h2>`, `<h3>`, `<p>`, `<ul>`, `<blockquote>`, `<code>`, `<pre>` — all styled via the `.prose` CSS block

**3.** Add an entry on `articles.html` archive (around line 150):

```html
<li class="article-item">
  <time class="date" datetime="2026-MM-DD">2026 · Mmm</time>
  <div class="body">
    <h3><a href="https://chairithinug.com/articles/your-slug.html">Your Title</a></h3>
    <p>One-sentence summary that previews the post.</p>
    <div class="meta">
      <span>N min read</span><span>·</span><span>topic · topic</span>
    </div>
  </div>
  <span class="read">Read</span>
</li>
```

**4.** Bump the article count in `articles.html` meta-row (around line 137):
```
<b>3</b>&nbsp; published   →   <b>3</b>&nbsp; published
```

**5.** Add the new article URL + lastmod to `sitemap.xml`:
```xml
<url>
  <loc>https://chairithinug.com/articles/your-slug.html</loc>
  <lastmod>2026-MM-DD</lastmod>
  <changefreq>yearly</changefreq>
  <priority>0.5</priority>
</url>
```

**6.** Add the URL to `service-worker.js` `urlsToCache` (around line 15) AND bump `CACHE_NAME` (see [§Service worker](#service-worker)).

**7.** Add the BlogPosting to `articles.html` JSON-LD `blogPost` array (around line 67):
```json
{
  "@type": "BlogPosting",
  "headline": "Your Title",
  "url": "https://chairithinug.com/articles/your-slug.html",
  "author": { "@id": "https://chairithinug.com/#person" },
  "datePublished": "2026-MM-DDTHH:MM:SS+02:00",
  "dateModified":  "2026-MM-DDTHH:MM:SS+02:00",
  "description": "One sentence."
}
```

---

## Add a new project

**1.** In `projects.html`, find the project grid (`<div class="proj-grid" id="proj-grid">`, line ~262). Pick the right chronological position and insert a new `<article class="proj-card">` block:

```html
<article class="proj-card" data-tags="ai web">
  <div class="head">
    <div class="ttl-row">
      <svg width="22" height="22" aria-hidden="true" focusable="false"><use href="#gh-mark"/></svg>
      <h3><a href="https://github.com/chairithinug/REPO" target="_blank" rel="noopener">Project Name</a></h3>
    </div>
    <div class="year-stamp-circle" style="--year-color: var(--saffron); --stamp-r: -5deg">
      <span class="yr">2026</span>
    </div>
  </div>
  <p>One- or two-sentence description.</p>
  <div class="tags"><span>Stack1</span><span>Stack2</span></div>
  <div class="file-code">DKT · PROJ-2026/NN</div>
</article>
```

**2.** Key fields:
- `data-tags="…"` — space-separated subset of `{ai, web, iot, vision, research}`. Drives the filter chips.
- `--year-color` — `var(--saffron)` for 2026, `var(--jade)` for 2025, `var(--copen)` for 2021, `var(--harbor)` for 2020, `var(--chili)` for 2019, `var(--saffron)` for 2018. Picks by era.
- `--stamp-r` — rotation in deg (-8° to +6°), varied per card.
- `<span class="yr">` — `2026` for shipped, `2026 →` for ongoing.
- `DKT · PROJ-YYYY/NN` — docket code, increment NN within the year.
- Add `<span class="private">Private</span>` after `</div></div>` (closing `.head`) if the repo isn't public; omit the `<a>` and use plain `<h3>` text.

**3.** Update the **filter chip counts** — they're now derived automatically from `data-tags` so just save and reload. No manual count edit needed.

**4.** Update the **meta-row counts** at top of the page (line ~190):
- `<b>10</b>&nbsp; shipped projects` → bump
- `<b>3</b>&nbsp; active this year` → bump if ongoing

**5.** Update the **MRZ strip** (line ~218): `<<10<ENTRIES<FILED<<` → `<<11<ENTRIES<FILED<<`

**6.** Update the **By year heatmap** (line ~210) — find the right year `<li>` and bump the `--n` and the `<i>` count display.

**7.** Update the **By category tagbars** (line ~230) — bump the count `<b>N</b>` and adjust the `width: N0%` (max is highest count).

**8.** Update the **`/projects.html` JSON-LD `itemListElement`** (line ~73) — add a `ListItem` at the next position, with `url`, `name`, `description`, `datePublished`, `image`, `keywords`.

**9.** Update the **home teaser** on `index.html` (around line 346): `<span>10 entries</span>` → `<span>11 entries</span>`.

**10.** Bump SW cache.

---

## Add or edit a FAQ entry

FAQ is **data-driven** since the recent refactor. Edit in two places:

**1.** `faq.html` — the `FAQ` array inside the inline `<script>` (around line 207). Add a row:

```js
{ q: "Your question?", a: "Your answer." }
```

The card markup is auto-generated from this array; index is the question number (N = position + 1).

**2.** `lang/{en,th,da}.json` — add three keys per new FAQ (`faq-q-N`, `faq-a-N`) in **all three** language files. EN can mirror the data-array value; TH and DA need real translations.

**3.** Update the `<script type="application/ld+json">` FAQPage in `faq.html` (line ~67) — append a `Question` to `mainEntity` with `name` (the question) and `acceptedAnswer.text` (the answer).

**4.** Bump the question count in the FAQ page meta-row (line ~190):
`<b>11</b>&nbsp; questions` → `<b>12</b>`.

**5.** Bump SW cache.

---

## Add or edit a skill tile

**1.** `skills.html` — find the right cluster (`§ 04.01.A` Programming, `B` ML tools, `C` Workflow, `D` Claude ecosystem, `E` Currently exploring; around lines 134–280).

**2.** Insert a tile:
```html
<div class="skill-tile fluent">
  <img src="/icons/your-tool.svg" alt="">
  <span>Tool Name</span>
  <span class="dots" aria-hidden="true"><span></span><span></span><span></span></span>
</div>
```

**3.** Set the band class on `.skill-tile`:
- `.fluent` → 3 dots filled (production-grade)
- `.comfortable` → 2 dots
- `.learning` → 1 dot

**4.** For Claude / Exploring clusters (no SVG icon), use a monogram instead of `<img>`:
```html
<span class="monogram" aria-hidden="true" style="background:var(--saffron)">C</span>
```
Pick the color from `{var(--saffron), var(--chili), var(--copen), var(--jade), var(--gold), var(--ink), var(--harbor)}`.

**5.** Add the icon SVG to `/icons/` if needed.

**6.** Update meta-row counts at top of `skills.html` (line ~118):
`<b>9</b>&nbsp; programming languages` → bump the relevant tally.

**7.** Update the home teaser count on `index.html`: `<span>32 entries</span>` → bump.

**8.** Bump SW cache.

---

## Add a certification

`skills.html` — `§ 04.03 Certifications` section, `<div class="cert-grid">` (around line 320). Add:

```html
<article class="cert-card">
  <div class="name">Cert Name</div>
  <div class="issuer">Issuing Org</div>
  <div class="when">MMM YYYY</div>
  <a class="link" href="https://verify-url" target="_blank" rel="noopener">Verify</a>
</article>
```

Bump cert count in meta-row + SW cache.

---

## Update career timeline

**The timeline is data-driven from a single array.** Two views (desktop SVG + mobile list) re-render automatically.

**1.** `site.js` — `TIMELINE` const (line ~12). Each entry shape:

```js
{ kind: 'place|academic|fulltime|parttime|volunteer',
  label: 'Short visible label',
  from: 2020.5,     // year + month/12 fraction
  to:   2023.7,
  note: 'One-line context shown below pill + in tooltip',
  color: 'var(--saffron)'  // optional, defaults to lane color
},
```

- `kind` determines the lane (and default pill color).
- `from`/`to` are decimal years. Examples: Jan = X.0, Jun = X.42, Aug = X.67, Dec = X.99.
- `place` entries get an explicit `color` per city (saffron=Bangkok, copen=Madison, harbor=Copenhagen).

**2.** If you add a new city the user lived in, also add a `BANDS` entry (line ~35) for the background swatch:
```js
{ from: 2026.6, to: 2027.5, label: 'YOUR_CITY', color: '#F3D8B5' }
```

**3.** Update `career.html`:
- `.meta-row` chapter count (line ~121): `<b>16</b>&nbsp; chapters` → `<b>17</b>`
- SVG caption (line ~145): `n = 16 chapters` → `n = 17`
- Add a matching `<article class="work-card">` (or `.edu-card`, or volunteer `.work-card` in `§ 02.04`) so the role appears in the card grid too.

**4.** Update `index.html` home page:
- Career teaser count (line ~340): `<span>16 entries</span>`
- Mobile-rendered timeline reads from same `TIMELINE` const — nothing to update there.

**5.** Bump SW cache.

---

## Update the Lately feed

`index.html` lines ~302–325. Each entry is a `<li>` with a `<time>`, a colored `<span class="tag tag-...">`, and a `<p data-i18n="recent-activity-N">`.

To add a new entry at the top:

1. Prepend a new `<li>` block to `<ul class="feed">`.
2. Renumber the `data-i18n="recent-activity-N"` keys (currently 1–5).
3. Update **all three** `lang/*.json` files: shift `recent-activity-1` down, insert your new copy at `recent-activity-1` in EN/TH/DA.

Available tag classes: `.tag-now` (saffron), `.tag-build` (Copenhagen blue), `.tag-life` (gold), `.tag-travel` (jade).

---

## Update spoken languages

`skills.html` `§ 04.02` (lines ~298–319). Each `<div class="lang-card">` has a name, a 5-dot proficiency bar, and a `.note` description (Native / TOEIC / PD3). To change a level, toggle `<i class="on">` vs `<i>` (filled vs empty dot).

---

## Update books

`books.html` — sections for Currently reading, Backlog, Finished, Coffee. Each is a `<div class="prose">` with a `<ul>` of `<li>` entries.

If you swap your **Currently reading** book:
1. Update the `<li>` in `books.html` §08.01.
2. Update the home **Now reading** card on `index.html` (lines ~319–326) — title, author, bar `--pct`, and the progress note.
3. Update the **What I'm reading** card on `articles.html` §05.02 (lines ~205–215).
4. Update the **JSON-LD** `ItemList` on `books.html` (line ~74) — reorder positions.

---

## Update interests + race results

`interests.html` §09.02. Each race is a `<article class="work-card">` block. To add a new race:

1. Insert an `<article>` in the `.proj-grid` (line ~150).
2. Update meta-row counts at the top.
3. For year-over-year improvement, hand-edit the SVG sparkline in the `<div class="race-progress">` block (lines ~127–164) — two `<text>` labels (old time, new time), the `polyline points` (start/end coordinates), and the `delta` span.

---

## Update personal/profile info (single source)

The **Person JSON-LD** in `index.html` (lines ~67–115) is now the canonical source. Other pages reference it via `@id="https://chairithinug.com/#person"`. Changing it propagates everywhere.

To update:
- Job titles → `jobTitle`
- Email → `email` + `mailto:` links in `chrome.js` footer + `articles/*` post-byline
- Phone → `telephone`
- Photo → `image` (URL) + any `<img>` `src` references
- LinkedIn / GitHub / Strava → `sameAs[]`
- Schools → `alumniOf[]`

If you change your nickname, location, or anything visible on the cover, also update:
- `index.html` passport-card body (lines ~140–220) — the bilingual field grid
- `chrome.js` nav crest + meta (line ~37: `<b>Anapat Chairithinugull</b><span class="meta">· Bangkok</span>`)
- `lang/*.json` `post-footer-name` if name format changed

---

## Translations (i18n)

The language switcher fetches `/lang/<lang>.json` and overlays values onto elements with `[data-i18n="key"]` (via textContent) and `[data-i18n-aria-label="key"]` (via aria-label).

**To translate new copy:**
1. Wrap the element: `<p data-i18n="my-new-key">English text</p>`
2. Add `"my-new-key": "translation"` to all **three** lang JSONs.
3. EN should mirror the visible HTML default — overlay is no-op for EN visitors.

**If the translation contains HTML** (e.g., a link inside cookie-desc):
- Add the key name to `HTML_KEYS` set in `site.js` (line ~371). Otherwise `textContent` strips the markup.

**To add a new language:**
1. Copy `lang/en.json` to `lang/<code>.json` and translate.
2. Add a button to `chrome.js` `.lang-switch` markup (line ~46): `<button data-lang="<code>">Label</button>`.
3. Add `<code>` to the allow-list in `site.js setLang` (line ~398): `if (!['en', 'th', 'da', '<code>'].includes(lang)) ...`
4. Add the `<code>` → `inLanguage` short form in `setLang` (`document.documentElement.lang = ...`, line ~402).

---

## Add a new top-level page

This is the most expensive change in the codebase — touches ~6 files. Steps:

1. **Copy `template.html`** as starting point. Update title, canonical, description, JSON-LD, breadcrumb, `<body data-page="key">`, `.page-mark` letter + label, h1 heading, meta-row.
2. **Add to `chrome.js` `PAGES` array** (line ~10): `{ key, href, label, num, i18n: 'nav-<key>' }`. The nav link and active-state highlighting flow from this.
3. **Add nav-`<key>` keys** to all three `lang/*.json` files.
4. **Add to `sitemap.xml`** with appropriate `priority` and `changefreq`.
5. **Add to `service-worker.js` `urlsToCache`** + bump `CACHE_NAME`.
6. **Add a teaser card** on `index.html` `<div class="teaser-grid teaser-grid--3">` (line ~339) — keep the 2×3 layout if possible.
7. **Pick a § number** that doesn't collide. Current map: 01 home · 02 career · 03 projects · 04 skills · 05 articles · 06 faq · 07 privacy · 08 books · 09 interests · 404 not found.
8. **Update README.md** page-numbering table.

---

## Service worker

`service-worker.js` line 1: `const CACHE_NAME = 'pwa-cache-vNN';`.

**Bump `vNN` on every push** that changes a cached file. The cache strategy is cache-first for non-navigation resources, so without a bump returning visitors keep the stale shell.

If you add/remove a URL, update `urlsToCache` (lines 3–25) too.

Reasonable convention: increment by 1 per commit if anything in `urlsToCache` (or any cached file's content) changed. If you forget, hard-refresh in DevTools → Application → Service Workers → Unregister to recover.

---

## Service-worker cache: full file list

The shell that gets pre-cached. Anything outside this list still works (network-first for navigations, network-only otherwise) but won't be offline-available.

```
HTML:       /, /index.html, /career.html, /projects.html, /skills.html,
            /articles.html, /faq.html, /books.html, /interests.html,
            /privacy.html, /404.html, /articles/<slug>.html
Assets:     /style.css, /site.js, /chrome.js, /manifest.webmanifest
SEO:        /robots.txt, /sitemap.xml
i18n:       /lang/en.json, /lang/th.json, /lang/da.json
Images:     /img/anapat_chairithinugull.jpeg + 3 .webp sizes
Favicons:   /icons/favicon/* (all sizes)
```

---

## Backups

Every meaningful version of the old (pre-redesign) site is preserved at:

- **Branch:** `legacy-tailwind-pre-bangkok-harbor` (mutable pointer)
- **Tag:** `v1-pre-bangkok-harbor` (immutable)

To compare current vs old:
```bash
git diff v1-pre-bangkok-harbor main
git log v1-pre-bangkok-harbor..main --oneline
```

To restore a specific old file:
```bash
git checkout v1-pre-bangkok-harbor -- path/to/file.html
```

To roll back the entire redesign (destructive — use only in emergency):
```bash
git revert v1-pre-bangkok-harbor..HEAD
git push
```

---

## Deploy

GitHub Pages auto-deploys from `main`. Push to publish:

```bash
git add -A
git commit -m "chore: <what you did>"
git push origin main
```

Production URL: `https://www.chairithinug.com` (fronted by Cloudflare). Updates appear within ~30 seconds, but Cloudflare may serve a cached version for 5–15 minutes. To force-purge, log into Cloudflare → Caching → Purge Everything.

---

## Common gotchas

- **Dark-mode flash**: every page has a tiny inline `<script>` in `<head>` before the stylesheet. **Do not move it to a deferred file** — it sets `data-theme` synchronously to prevent a flash of light theme. The CSP allows it via a SHA-256 hash; if you ever edit that inline script, recompute the hash and update every page's `script-src` accordingly:
  ```bash
  python3 -c "import hashlib,base64; print('sha256-' + base64.b64encode(hashlib.sha256(open('/tmp/new-fouc.js','rb').read()).digest()).decode())"
  ```
- **Absolute paths everywhere**: every `<img>`, `<script>`, `<link>`, and CSS `url(...)` uses `/...` paths. The site WILL break if served from a sub-path (e.g. `chairithinug.github.io/preview/`). Use a separate root host (Vercel, Cloudflare Pages, or temporarily swap GH Pages source branch).
- **The lang switcher only flips what's wired**: ~75 of 84 keys are reachable today. If you add new visible copy that should translate, you need to (a) wrap in `[data-i18n]` and (b) add the key to all 3 lang JSONs.
- **`I18N` inline const in `site.js`** (line ~52) holds 4 passport-card keys as a zero-fetch fallback. These keys are **deliberately not in lang JSONs**. If you change a passport label, edit the inline const, not the JSON.
- **Filter chip counts are derived** (since the recent refactor) — adding a project automatically updates the count next page-load. No more hardcoded `All · 9`.
- **Skill-tile proficiency labels are injected at runtime** by `initSkillTileLabels` in `site.js` based on the tile's `.fluent / .comfortable / .learning` class. Don't add a sr-only span manually; just set the right class.
- **External-link "(opens in new tab)" hints are injected** by `initExternalLinkLabels` for any `a[target="_blank"]` without an explicit `aria-label`. If you need a custom label, set `aria-label` directly and the init will respect it.
- **Timeline SVG is `aria-hidden`** — the canonical AT representation is the `<ol class="tl-mobile">` next to it. If you change the chart data, both `TIMELINE` (drives SVG) and `renderTimelineMobile` (drives the list) read from the same const, so they stay in sync automatically.
- **Background guilloché must also be drawn on colored sections**, because `.section-block.alt/.warm/.deep/.ink`, `.timeline-section`, `.teasers`, `.contact` all sit at `z-index: 2` and would mask the `body::after`. The CSS uses `--bg-pattern` (dark strokes) / `--bg-pattern-light` (light strokes) and picks per section + per theme depending on whether the resulting surface is light or dark.
- **`MAINTAINING.md` (this file) is gitignored only via `.claude/` and `CLAUDE.md` patterns** — confirm it's committed: `git ls-files MAINTAINING.md`.

---

## When something breaks

- **JS init chain**: every init function in `site.js` is wrapped in try/catch (line ~580). One failure no longer kills the rest. Check the DevTools console — failures log as `[site.js] <name> failed: ...`.
- **CSP violations**: appear in DevTools console as `Refused to ... because it violates the following Content Security Policy directive: ...`. The most common cause is adding an inline `<script>` that wasn't part of the hash. Either compute a new hash or move the script to an external file.
- **GA not loading**: open `/privacy.html`, click Accept on the cookie banner. GA is gated and won't load until consent. Verify in DevTools → Network → filter "google".
- **Service worker serving stale content**: DevTools → Application → Service Workers → Unregister → reload. Or browse in incognito.

---

Last updated alongside the Bangkok Harbor redesign. If you tear out a section or change the architecture, update this file too.
