/* chrome.js — shared nav + mobile menu + footer chrome
 * Injects into [data-chrome="nav"], [data-chrome="menu"], [data-chrome="footer"].
 * Active page is read from document.body.dataset.page.
 * Run BEFORE site.js so its querySelectors find the injected DOM.
 */

(() => {
  'use strict';

  const PAGES = [
    { key: 'career',   href: '/career.html',   label: 'Career',   num: '§ 02' },
    { key: 'projects', href: '/projects.html', label: 'Projects', num: '§ 03' },
    { key: 'skills',   href: '/skills.html',   label: 'Skills',   num: '§ 04' },
    { key: 'articles', href: '/articles.html', label: 'Articles', num: '§ 05' },
    { key: 'faq',      href: '/faq.html',      label: 'FAQ',      num: '§ 06' },
  ];
  const HOME = { key: 'home', href: '/index.html', label: 'Home', num: '§ 01' };

  const active = document.body.dataset.page || 'home';

  function navHTML() {
    const links = PAGES.map(p =>
      `<a href="${p.href}"${p.key === active ? ' class="active"' : ''}>${p.label}</a>`
    ).join('');
    return `
      <div class="nav-inner">
        <a class="nav-mark" href="/" aria-label="Home">
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
            <a href="https://www.linkedin.com/in/anapat-chairithinugull" rel="noopener noreferrer">LinkedIn</a>
            <a href="https://github.com/chairithinug" rel="noopener noreferrer">GitHub</a>
            <a href="/index.html#contact">More ways</a>
          </div>
        </div>
        <div class="foot-bar">
          <span>© 2026 Anapat Chairithinugull · <a href="/privacy.html#privacy" data-i18n="footer-privacy">Privacy</a> · <a href="/privacy.html#accessibility" data-i18n="footer-accessibility">Accessibility</a></span>
        </div>
      </div>`;
  }

  function cookieBannerHTML() {
    return `
      <div id="cookie-overlay" hidden></div>
      <div id="cookie-banner" role="dialog" aria-modal="true"
           aria-labelledby="cookie-banner-title" aria-describedby="cookie-banner-desc" inert>
        <p id="cookie-banner-title" class="sr-only">Cookie consent</p>
        <p id="cookie-banner-desc" data-i18n="cookie-desc">
          I use anonymized analytics cookies (PDPA / GDPR compliant). Reject does not affect site functionality.
          See <a href="/privacy.html">privacy policy</a>.
        </p>
        <div class="cookie-actions">
          <button id="accept-cookies" type="button"
                  aria-label="Accept cookies and continue" data-i18n-aria-label="aria-accept-cookies">
            <span data-i18n="cookie-accept">Accept</span>
          </button>
          <button id="reject-cookies" type="button"
                  aria-label="Reject cookies and continue" data-i18n-aria-label="aria-reject-cookies">
            <span data-i18n="cookie-reject">Reject</span>
          </button>
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

  // Cookie banner — append to body so it floats over content
  const bannerHost = document.createElement('div');
  bannerHost.innerHTML = cookieBannerHTML();
  document.body.appendChild(bannerHost);
  setupCookies();

  // PWA: register service worker (graceful no-op if unavailable)
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').catch(() => { /* offline-only */ });
    });
  }

  // ─── Cookie consent + Google Analytics (gated) ───────────────────────────
  function setupCookies() {
    const overlay   = document.getElementById('cookie-overlay');
    const banner    = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('accept-cookies');
    const rejectBtn = document.getElementById('reject-cookies');
    if (!banner || !overlay) return;

    let storageOk = true;
    try { localStorage.setItem('__t__', '1'); localStorage.removeItem('__t__'); }
    catch (e) { storageOk = false; }
    let sessionConsent = null;
    const read  = () => { try { return storageOk ? localStorage.getItem('cookieConsent') : sessionConsent; } catch (e) { return sessionConsent; } };
    const write = (v) => { sessionConsent = v; if (storageOk) { try { localStorage.setItem('cookieConsent', v); } catch (e) { storageOk = false; } } };

    const showBanner = () => {
      overlay.hidden = false;
      banner.removeAttribute('inert');
      banner.classList.add('visible');
      // Move keyboard focus to a real button inside the modal so Tab stays trapped
      (acceptBtn || rejectBtn)?.focus();
    };
    const hideBanner = () => {
      banner.setAttribute('inert', '');
      banner.classList.remove('visible');
      overlay.hidden = true;
    };

    const consent = read();
    if (consent === 'accepted') { hideBanner(); loadAnalytics(); }
    else if (consent === 'rejected') { hideBanner(); }
    else { showBanner(); }

    acceptBtn?.addEventListener('click', () => { write('accepted'); hideBanner(); loadAnalytics(); });
    rejectBtn?.addEventListener('click', () => { write('rejected'); hideBanner(); });
    banner.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { hideBanner(); return; }
      if (e.key !== 'Tab') return;
      // Trap focus inside the modal between Accept and Reject
      const focusables = [acceptBtn, rejectBtn].filter(Boolean);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  function loadAnalytics() {
    if (document.getElementById('ga-script')) return;
    const s = document.createElement('script');
    s.id = 'ga-script';
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-FJQNSE4GQC';
    s.async = true;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-FJQNSE4GQC', { anonymize_ip: true });
    trackOutboundLinks();
  }

  function trackOutboundLinks() {
    if (typeof window.gtag !== 'function') return;
    const map = [
      ['a[href*="linkedin.com"]',  'LinkedIn'],
      ['a[href*="github.com"]',    'GitHub'],
      ['a[href*="strava.com"]',    'Strava'],
      ['a[href*="Anapat_Chairithinugull_Resume_polished.pdf"]', 'Resume'],
      ['a[href*="ATS_friendly_Anapat_Chairithinugull.pdf"]',    'Resume (ATS)'],
    ];
    map.forEach(([sel, label]) => {
      document.querySelectorAll(sel).forEach(el => {
        el.addEventListener('click', () => {
          try { window.gtag('event', 'click', { event_category: 'Link', event_label: label }); }
          catch (e) {}
        });
      });
    });
  }
})();
