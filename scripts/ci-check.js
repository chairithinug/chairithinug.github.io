#!/usr/bin/env node
/* Static-site integrity checks — no dependencies, no build step.
 *
 * Guards the things a hand-edited static site silently breaks:
 *   1. Per-page HTML sanity (lang, title, viewport, manifest link, one <h1>,
 *      the inline anti-flash theme script, the chrome.js/site.js includes).
 *   2. Internal link/asset integrity — every local href/src resolves to a file.
 *   3. Service-worker precache integrity — every urlsToCache entry exists.
 *   4. Web-app-manifest installability (the PWA criteria Chrome enforces).
 *
 * Run: node scripts/ci-check.js   (exit 0 = clean, 1 = problems found)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const problems = [];
const fail = (where, msg) => problems.push(`${where}: ${msg}`);

const exists = (rel) => {
  try { fs.accessSync(path.join(ROOT, rel)); return true; } catch { return false; }
};
const read = (rel) => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// Top-level pages + articles. Templates/scratch live in unused/ and are skipped.
const htmlFiles = [
  ...fs.readdirSync(ROOT).filter(f => f.endsWith('.html')),
  ...(exists('articles') ? fs.readdirSync(path.join(ROOT, 'articles'))
      .filter(f => f.endsWith('.html')).map(f => 'articles/' + f) : []),
].filter(f => !f.startsWith('template') && f !== 'articles/post-template.html');

/* ── 1. per-page HTML sanity ─────────────────────────────────────────────── */
for (const f of htmlFiles) {
  const html = read(f);
  const need = [
    [/<html[^>]+\blang=/i, 'missing <html lang="…">'],
    [/<title>[^<]+<\/title>/i, 'missing or empty <title>'],
    [/<meta[^>]+name=["']viewport["']/i, 'missing viewport meta'],
    [/<link[^>]+rel=["']manifest["']/i, 'missing manifest <link>'],
    [/document\.documentElement[\s\S]{0,80}data-theme/i, 'missing inline anti-flash theme script'],
    [/<script[^>]+src=["']\/chrome\.js["']/i, 'missing /chrome.js include'],
    [/<script[^>]+src=["']\/site\.js["']/i, 'missing /site.js include'],
  ];
  for (const [re, msg] of need) if (!re.test(html)) fail(f, msg);
  const h1s = (html.match(/<h1[\s>]/gi) || []).length;
  if (h1s !== 1) fail(f, `expected exactly one <h1>, found ${h1s}`);
}

/* ── 2. internal link / asset integrity ──────────────────────────────────── */
const isExternal = (u) => /^(https?:|mailto:|tel:|data:|\/\/|#)/i.test(u);
const resolveRef = (fromFile, url) => {
  const clean = url.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (clean.startsWith('/')) return clean.slice(1) || 'index.html';
  return path.join(path.dirname(fromFile), clean);
};
for (const f of htmlFiles) {
  const html = read(f);
  const refs = [...html.matchAll(/(?:href|src)=["']([^"']+)["']/gi)].map(m => m[1]);
  for (const url of refs) {
    if (isExternal(url)) continue;
    let rel = resolveRef(f, url);
    if (rel == null) continue;
    // A bare directory like "/" resolves to its index.html
    if (rel.endsWith('/')) rel += 'index.html';
    if (!exists(rel)) fail(f, `broken local reference → ${url}`);
  }
}
// CSS url() that point at real local files. Skip data: URIs, remote URLs, and
// in-document SVG fragments (#id, or %23id when url-encoded inside a data: SVG);
// only values with a real file extension are treated as asset references.
if (exists('style.css')) {
  const css = read('style.css');
  for (const m of css.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi)) {
    const u = m[1].trim();
    if (/^(data:|https?:|\/\/|#|%23)/i.test(u)) continue;
    if (!/\.[a-z0-9]{2,5}($|[?#])/i.test(u)) continue;   // needs a file extension
    const rel = u.split('#')[0].split('?')[0].replace(/^\//, '');
    if (!exists(rel)) fail('style.css', `broken url() → ${u}`);
  }
}

/* ── 3. service-worker precache integrity ────────────────────────────────── */
if (exists('service-worker.js')) {
  const sw = read('service-worker.js');
  const block = (sw.match(/urlsToCache\s*=\s*\[([\s\S]*?)\]/) || [])[1] || '';
  // strip // comments so quoted words inside them aren't mistaken for URLs
  const urls = [...block.replace(/\/\/[^\n]*/g, '').matchAll(/["']([^"']+)["']/g)].map(m => m[1]);
  if (!urls.length) fail('service-worker.js', 'could not parse urlsToCache');
  for (const u of urls) {
    const rel = u === '/' ? 'index.html' : u.replace(/^\//, '');
    if (!exists(rel)) fail('service-worker.js', `precached file missing on disk → ${u}`);
  }
  if (!/addEventListener\(\s*['"]fetch['"]/.test(sw)) fail('service-worker.js', 'no fetch handler (required for PWA)');
  if (!/const\s+CACHE_NAME\s*=\s*['"][^'"]+['"]/.test(sw)) fail('service-worker.js', 'no CACHE_NAME version string');
}

/* ── 4. web-app-manifest installability ──────────────────────────────────── */
if (exists('manifest.webmanifest')) {
  let m;
  try { m = JSON.parse(read('manifest.webmanifest')); }
  catch (e) { fail('manifest.webmanifest', 'invalid JSON: ' + e.message); }
  if (m) {
    if (!(m.name || m.short_name)) fail('manifest', 'needs name or short_name');
    if (!['standalone', 'fullscreen', 'minimal-ui'].includes(m.display)) fail('manifest', `display must be app-like, got "${m.display}"`);
    if (!m.start_url) fail('manifest', 'missing start_url');
    if (m.prefer_related_applications === true) fail('manifest', 'prefer_related_applications must not be true');
    const icons = m.icons || [];
    const anyPng = (s) => icons.some(i => (i.sizes || '').split(/\s+/).includes(s) && i.type === 'image/png' && (!i.purpose || i.purpose.split(/\s+/).includes('any')));
    if (!anyPng('192x192')) fail('manifest', 'missing 192x192 PNG icon (purpose any)');
    if (!anyPng('512x512')) fail('manifest', 'missing 512x512 PNG icon (purpose any)');
    if (!icons.some(i => (i.purpose || '').split(/\s+/).includes('maskable'))) fail('manifest', 'missing a maskable icon');
    for (const i of icons) {
      const rel = new URL(i.src, 'https://x.com/manifest.webmanifest').pathname.slice(1);
      if (!exists(rel)) fail('manifest', `icon file missing → ${i.src}`);
    }
  }
}

/* ── report ──────────────────────────────────────────────────────────────── */
if (problems.length) {
  console.error(`\n✗ ${problems.length} integrity problem(s):\n`);
  for (const p of problems) console.error('  • ' + p);
  console.error('');
  process.exit(1);
}
console.log(`✓ integrity OK — ${htmlFiles.length} pages, links/assets/SW-precache/manifest all valid`);
