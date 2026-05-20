/* chrome.js — shared nav + mobile menu + footer chrome
 * Injects into [data-chrome="nav"], [data-chrome="menu"], [data-chrome="footer"].
 * Active page is read from document.body.dataset.page.
 * Run BEFORE site.js so its querySelectors find the injected DOM.
 */

(() => {
  'use strict';

  const PAGES = [
    { key: 'career',   href: 'career.html',   label: 'Career',   num: '§ 02' },
    { key: 'projects', href: 'projects.html', label: 'Projects', num: '§ 03' },
    { key: 'skills',   href: 'skills.html',   label: 'Skills',   num: '§ 04' },
    { key: 'articles', href: 'articles.html', label: 'Articles', num: '§ 05' },
    { key: 'faq',      href: 'faq.html',      label: 'FAQ',      num: '§ 06' },
  ];
  const HOME = { key: 'home', href: 'index.html', label: 'Home', num: '§ 01' };

  // Anchor links — only meaningful on home page; on others these become Home + anchor
  const HOME_LINKS = [
    { key: 'timeline', href: 'index.html#timeline', label: 'Career'   },
    { key: 'projects', href: 'index.html#projects', label: 'Projects' },
    { key: 'lately',   href: 'index.html#lately',   label: 'Lately'   },
    { key: 'contact',  href: 'index.html#contact',  label: 'Hello'    },
  ];

  const active = document.body.dataset.page || 'home';

  function navHTML() {
    const links = PAGES.map(p =>
      `<a href="${p.href}"${p.key === active ? ' class="active"' : ''}>${p.label}</a>`
    ).join('');
    return `
      <div class="nav-inner">
        <a class="nav-mark" href="index.html" aria-label="Home">
          <span class="crest" aria-hidden="true">A</span>
          <b>Anapat Chairithinugull</b>
          <span class="meta">· Bangkok</span>
        </a>
        <nav class="nav-links" aria-label="Primary">${links}</nav>
        <div class="nav-tools">
          <div class="lang-switch" role="group" aria-label="Language">
            <button data-lang="en" aria-pressed="true">EN</button>
            <button data-lang="th" aria-pressed="false">ไทย</button>
            <button data-lang="da" aria-pressed="false">DA</button>
          </div>
          <button class="theme-btn" id="theme-btn" aria-label="Toggle dark mode" title="Toggle dark mode">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/>
            </svg>
          </button>
          <button class="menu-btn" id="menu-btn" aria-label="Open menu" aria-expanded="false">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
              <path d="M4 7h16M4 12h16M4 17h16"/>
            </svg>
          </button>
        </div>
      </div>`;
  }

  function menuHTML() {
    const items = [HOME, ...PAGES].map(p => `
      <li><a href="${p.href}"${p.key === active ? ' aria-current="page"' : ''}>${p.label} <span>${p.num}</span></a></li>
    `).join('');
    return `
      <div class="top">
        <span class="eyebrow">Navigate</span>
        <button id="menu-close" aria-label="Close menu" style="font-size:24px">×</button>
      </div>
      <ul>${items}</ul>`;
  }

  function footerHTML() {
    return `
      <div class="wrap">
        <div class="slim-foot">
          <div>
            <div class="eyebrow">Get in touch</div>
            <a href="mailto:chairithinug@uwalumni.com" class="big-mail">chairithinug@uwalumni.com</a>
          </div>
          <div class="slim-links">
            <a href="https://www.linkedin.com/in/anapat-chairithinugull">LinkedIn</a>
            <a href="https://github.com/chairithinug">GitHub</a>
            <a href="index.html#contact">More ways</a>
          </div>
        </div>
        <div class="foot-bar">
          <span>© 2026 Anapat Chairithinugull · Built with HTML, Plex &amp; care</span>
          <span>EN · ไทย · DA &nbsp;·&nbsp; v6.4</span>
        </div>
      </div>`;
  }

  function tweaksHTML() {
    return `
      <div class="title">
        <span>Tweaks</span>
        <button id="tweaks-close" aria-label="Close tweaks">×</button>
      </div>
      <div class="tweak-row">
        <span class="label">Accent</span>
        <div class="swatches" id="accent-swatches">
          <button class="swatch" data-accent="#D17B3F" style="background:#D17B3F" aria-label="Saffron"></button>
          <button class="swatch" data-accent="#B23E3A" style="background:#B23E3A" aria-label="Chili"></button>
          <button class="swatch" data-accent="#3D6FA3" style="background:#3D6FA3" aria-label="Copenhagen blue"></button>
          <button class="swatch" data-accent="#6B8E7F" style="background:#6B8E7F" aria-label="Jade"></button>
        </div>
      </div>
      <div class="tweak-row">
        <span class="label">Theme</span>
        <div class="segmented" id="theme-seg">
          <button data-theme="light" aria-pressed="true">Paper</button>
          <button data-theme="dark" aria-pressed="false">Ink</button>
        </div>
      </div>
      <div class="tweak-row">
        <span class="label">Bilingual labels</span>
        <div class="segmented" id="bilingual-seg">
          <button data-bilingual="both" aria-pressed="true">Both</button>
          <button data-bilingual="en" aria-pressed="false">EN</button>
          <button data-bilingual="th" aria-pressed="false">ไทย</button>
        </div>
      </div>
      <div class="tweak-row">
        <span class="label">Background</span>
        <div class="segmented" id="bg-seg">
          <button data-bg="flat" aria-pressed="false">Flat</button>
          <button data-bg="grain" aria-pressed="true">Grain</button>
          <button data-bg="grid" aria-pressed="false">Grid</button>
        </div>
      </div>`;
  }

  function inject(selector, html) {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  }

  inject('[data-chrome="nav"]', navHTML());
  inject('[data-chrome="menu"]', menuHTML());
  inject('[data-chrome="footer"]', footerHTML());
  inject('[data-chrome="tweaks"]', tweaksHTML());

  // PWA: register service worker (graceful no-op if unavailable)
  if ('serviceWorker' in navigator && location.protocol !== 'about:') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(() => { /* offline-only */ });
    });
  }
})();
