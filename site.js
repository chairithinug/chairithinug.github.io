/* ─────────────────────────────────────────────────────────────
   Anapat Chairithinugull · site.js
   Timeline rendering, theme + lang, mobile menu, tweaks panel
   ───────────────────────────────────────────────────────────── */

(() => {
  'use strict';

  /* ───── DATA ───── */
  const TIMELINE = [
    { kind: 'academic',  label: 'Suankularb HS',                from: 2012,    to: 2016,    note: 'OSK 134 · Bangkok' },
    { kind: 'volunteer', label: 'Secretary · SKCC',             from: 2014.5,  to: 2015.83, note: 'Suankularb Computer Club' },
    { kind: 'academic',  label: 'BS CE/CS · Wisconsin',         from: 2016,    to: 2020.4,  note: 'In: EE — Out: Computer Engineer' },
    { kind: 'parttime',  label: 'WISEST · LoRa IoT',            from: 2018.4,  to: 2018.7,  note: 'Dairy biosensors' },
    { kind: 'volunteer', label: 'IEEE · UW Madison',            from: 2018.2,  to: 2020.4,  note: 'Project Officer, then VP' },
    { kind: 'parttime',  label: 'RIS API Intern',               from: 2019.5,  to: 2019.6,  note: 'Mulesoft RESTful APIs' },
    { kind: 'parttime',  label: 'UG Lab Asst · UW',             from: 2019.67, to: 2019.99, note: 'Madison' },
    { kind: 'volunteer', label: 'CS Tutor · CSLC',              from: 2019.67, to: 2019.99, note: 'UW Madison' },
    { kind: 'volunteer', label: 'Webmaster · Tau Beta Pi WI-A', from: 2019.25, to: 2020.4,  note: 'UW Madison' },
    { kind: 'fulltime',  label: 'Kasikorn Labs · Biometrics',   from: 2020.5,  to: 2023.7,  note: 'Face recognition for K+ app' },
    { kind: 'academic',  label: 'MSc CS · UCPH',                from: 2023.7,  to: 2025.5,  note: 'Thesis: Temporal GNNs for CFD · 9.5/12' },
    { kind: 'volunteer', label: 'Studenterhuset Bar',           from: 2023.67, to: 2024.83, note: 'Copenhagen' },
    { kind: 'parttime',  label: 'Det Kgl. Bibliotek',           from: 2024.5,  to: 2025.5,  note: 'Danish radio/TV archive segmentation' },
    { kind: 'parttime',  label: 'Resident Assistant',           from: 2024.6,  to: 2025.7,  note: 'Bispebjerg Kollegiet' },
    { kind: 'volunteer', label: 'VP Digital · TSAAD',           from: 2025.7,  to: 2026.5,  note: 'Thai Students in Denmark' },
    { kind: 'fulltime',  label: 'Open to hire',                 from: 2026.3,  to: 2026.6,  note: 'AI / ML / Data — Thailand' },
  ];

  const BANDS = [
    { from: 2012,    to: 2016,    label: 'BANGKOK',    color: '#F3D8B5' },
    { from: 2016,    to: 2020.4,  label: 'MADISON',    color: '#D6DCE8' },
    { from: 2020.4,  to: 2023.7,  label: 'BANGKOK',    color: '#F3D8B5' },
    { from: 2023.7,  to: 2026.3,  label: 'COPENHAGEN', color: '#CFD9DD' },
    { from: 2026.3,  to: 2026.6,  label: 'BANGKOK',    color: '#F3D8B5' },
  ];

  const LANES = {
    place:     { yOffset: 0,   color: 'var(--ink)',     label: 'Place' },
    academic:  { yOffset: 80,  color: 'var(--jade)',    label: 'Academic' },
    fulltime:  { yOffset: 160, color: 'var(--copen)',   label: 'Full-time' },
    parttime:  { yOffset: 240, color: 'var(--saffron)', label: 'Part-time' },
    volunteer: { yOffset: 320, color: 'var(--chili)',   label: 'Volunteer' },
  };

  const LANE_COLOR = {
    place:     'var(--ink)',
    academic:  'var(--jade)',
    fulltime:  'var(--copen)',
    parttime:  'var(--saffron)',
    volunteer: 'var(--chili)',
  };

  /* ───── I18N STRINGS (lightweight) ───── */
  const I18N = {
    en: {
      'title':       'Personal Portfolio &nbsp;·&nbsp; Type P',
      'title-th':    'หนังสือพอร์ตโฟลิโอส่วนตัว',
      'holder':      'Holder · ผู้ถือ',
      'signature':   'Signature',
    },
    th: {
      'title':       'พอร์ตโฟลิโอส่วนตัว &nbsp;·&nbsp; ฉบับที่ P',
      'title-th':    'Personal Portfolio',
      'holder':      'ผู้ถือ',
      'signature':   'ลายเซ็น',
    },
    da: {
      'title':       'Personlig Portefølje &nbsp;·&nbsp; Type P',
      'title-th':    'หนังสือพอร์ตโฟลิโอส่วนตัว',
      'holder':      'Indehaver · ผู้ถือ',
      'signature':   'Underskrift',
    },
  };

  /* ───── DESKTOP TIMELINE SVG ───── */
  function renderTimelineSVG() {
    const host = document.getElementById('tl-chart');
    if (!host) return;

    // 1) Assign sub-rows per lane using LABEL X-RANGE overlap detection
    //    (not just time-pill overlap — sequential entries with long labels
    //    can still horizontally collide). Greedy interval scheduling.
    const laneOrder = ['place', 'academic', 'fulltime', 'parttime', 'volunteer'];
    const byLane = {};
    laneOrder.forEach(k => { byLane[k] = []; });
    TIMELINE.forEach(e => { (byLane[e.kind] || (byLane[e.kind] = [])).push(e); });

    // Geometry constants (need xFor before sub-row assignment now)
    const SUBROW = 38;
    const LANE_GAP = 80;
    const PADL = 110, PADR = 60, PADT = 56, PADB = 60;
    const CW = 1200;
    const xFor = yr => PADL + ((yr - 2012) / (2026.6 - 2012)) * (CW - PADL - PADR);

    // Approximate label width — Plex Sans at 12.5px ≈ 7.2 px/char average
    const labelW = lbl => lbl.length * 7.2 + 14;

    const laneSubRows = {};
    laneOrder.forEach(k => {
      const sorted = byLane[k].slice().sort((a, b) => a.from - b.from);
      const rowEnds = []; // last conflict-end-x per sub-row
      sorted.forEach(e => {
        const startX = xFor(e.from);
        const pillEnd = xFor(e.to);
        const labelEnd = startX + labelW(e.label);
        const myEnd = Math.max(pillEnd, labelEnd) + 6;
        let row = rowEnds.findIndex(end => end <= startX);
        if (row === -1) { rowEnds.push(myEnd); row = rowEnds.length - 1; }
        else { rowEnds[row] = myEnd; }
        e._row = row;
      });
      laneSubRows[k] = Math.max(1, rowEnds.length);
    });

    // 2) Lane Y positions — lanes with multiple sub-rows expand.
    const laneY = {};
    let y = 0;
    laneOrder.forEach(k => {
      laneY[k] = y;
      y += LANE_GAP + (laneSubRows[k] - 1) * SUBROW;
    });
    const lastLaneY = y - LANE_GAP;
    const CH = PADT + lastLaneY + 36 + PADB;

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', `0 0 ${CW} ${CH}`);
    svg.setAttribute('width', '100%');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'Career timeline from 2012 to present');

    const el = (tag, attrs = {}, parent = svg) => {
      const n = document.createElementNS(svgNS, tag);
      for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
      parent.appendChild(n);
      return n;
    };

    // Place bands
    BANDS.forEach(b => {
      const x1 = xFor(b.from), x2 = xFor(b.to);
      el('rect', {
        x: x1, y: PADT - 24, width: x2 - x1, height: CH - PADT - PADB + 50,
        fill: b.color, opacity: 0.5,
      });
      el('text', {
        x: x1 + 6, y: PADT - 28,
        'font-family': 'var(--font-mono)', 'font-size': 9,
        'letter-spacing': '0.16em', fill: 'var(--ink-muted)',
      }).textContent = b.label;
    });

    // Lane baselines + labels (anchored to sub-row 0)
    Object.entries(LANES).forEach(([key, lane]) => {
      const yLane = PADT + laneY[key];
      el('line', {
        x1: PADL, y1: yLane, x2: CW - PADR, y2: yLane,
        stroke: 'var(--rule)', 'stroke-dasharray': '2 4',
      });
      el('text', {
        x: PADL - 12, y: yLane + 4, 'text-anchor': 'end',
        'font-family': 'var(--font-mono)', 'font-size': 10,
        fill: 'var(--ink-muted)', 'letter-spacing': '0.1em',
      }).textContent = lane.label.toUpperCase();
    });

    // Year ticks
    [2012, 2014, 2016, 2018, 2020, 2022, 2024, 2026].forEach(yr => {
      const x = xFor(yr);
      el('line', { x1: x, y1: CH - PADB + 6, x2: x, y2: CH - PADB + 14, stroke: 'var(--ink-muted)' });
      el('text', {
        x, y: CH - PADB + 30, 'text-anchor': 'middle',
        'font-family': 'var(--font-mono)', 'font-size': 11, fill: 'var(--ink)',
      }).textContent = yr;
    });
    el('line', {
      x1: PADL, y1: CH - PADB + 6, x2: CW - PADR, y2: CH - PADB + 6,
      stroke: 'var(--ink)',
    });

    // Entries — pills + labels (sub-rows offset within the lane)
    TIMELINE.forEach(e => {
      const lane = LANES[e.kind];
      const totalRows = laneSubRows[e.kind];
      const yEntry = PADT + laneY[e.kind] + (e._row || 0) * SUBROW;
      const x1 = xFor(e.from), x2 = xFor(e.to);
      const w = Math.max(8, x2 - x1);
      const r = 7;
      // Pill
      el('rect', { x: x1, y: yEntry - r, width: w, height: r * 2, fill: lane.color, opacity: 0.18, rx: r });
      // Dots
      el('circle', { cx: x1, cy: yEntry, r: r - 1, fill: lane.color });
      el('circle', { cx: x2, cy: yEntry, r: r - 3, fill: lane.color, opacity: 0.6 });
      // Group for hover + accessibility
      const g = el('g', { class: 'tl-entry', tabindex: 0 });
      g.style.cursor = 'pointer';
      el('title', {}, g).textContent = `${e.label} · ${e.note}`;
      el('rect', { x: x1 - 3, y: yEntry - 18, width: Math.max(80, w + 6), height: 38, fill: 'transparent' }, g);

      // Label placement:
      //  - single sub-row in lane → label above pill, note below
      //  - multi sub-row, row 0 → label above only
      //  - multi sub-row, row 1+ → label below pill only (avoid colliding upward)
      const placeBelow = totalRows > 1 && (e._row || 0) > 0;
      const skipNote = totalRows > 1;
      const labelY = placeBelow ? yEntry + 18 : yEntry - 12;
      const label = el('text', {
        x: x1 + 4, y: labelY,
        'font-family': 'var(--font-sans)', 'font-size': 12.5,
        fill: 'var(--ink)', 'font-weight': 600,
      }, g);
      label.textContent = e.label;
      if (!skipNote) {
        const note = el('text', {
          x: x1 + 4, y: yEntry + 22,
          'font-family': 'var(--font-mono)', 'font-size': 10,
          fill: 'var(--ink-muted)',
        }, g);
        note.textContent = e.note;
      }
      g.addEventListener('mouseenter', () => label.setAttribute('fill', lane.color));
      g.addEventListener('mouseleave', () => label.setAttribute('fill', 'var(--ink)'));
    });

    // Now marker
    const nowX = xFor(2026.4);
    el('line', {
      x1: nowX, y1: PADT - 28, x2: nowX, y2: CH - PADB + 8,
      stroke: 'var(--chili)', 'stroke-dasharray': '3 3',
    });
    el('rect', { x: nowX - 24, y: PADT - 46, width: 48, height: 20, fill: 'var(--chili)', rx: 3 });
    el('text', {
      x: nowX, y: PADT - 32, 'text-anchor': 'middle',
      'font-family': 'var(--font-mono)', 'font-size': 11,
      fill: '#fff', 'letter-spacing': '0.14em',
    }).textContent = 'NOW';

    host.appendChild(svg);
  }

  /* ───── MOBILE TIMELINE (vertical) ───── */
  function renderTimelineMobile() {
    const ol = document.getElementById('tl-mobile');
    if (!ol) return;
    // Sorted reverse-chronological (most recent first)
    const sorted = [...TIMELINE].sort((a, b) => b.from - a.from);
    sorted.forEach(e => {
      const li = document.createElement('li');
      li.className = 'tl-row';
      li.style.setProperty('--lane', LANE_COLOR[e.kind]);
      const fmt = y => {
        const yr = Math.floor(y);
        return yr;
      };
      const span = e.from === e.to ? `${fmt(e.from)}` : `${fmt(e.from)}–${String(fmt(e.to)).slice(-2)}`;
      li.innerHTML = `
        <div class="when">${span}</div>
        <span class="dot" aria-hidden="true"></span>
        <div class="body">
          <h3>${e.label}</h3>
          <p>${e.note}</p>
          <span class="kind">${e.kind}</span>
        </div>
      `;
      ol.appendChild(li);
    });
  }

  /* ───── THEME ───── */
  function initTheme() {
    const saved = localStorage.getItem('theme');
    const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved || (sysDark ? 'dark' : 'light');
    setTheme(initial);

    document.getElementById('theme-btn')?.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }
  function setTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    // Sync segmented in tweaks
    document.querySelectorAll('#theme-seg button').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.theme === theme ? 'true' : 'false');
    });
  }

  /* ───── LANGUAGE ───── */
  // Resolve lang/*.json relative to site root regardless of page depth (works for /articles/*)
  const LANG_URL = (lang) => '/lang/' + lang + '.json';
  const langCache = {};

  function applyDict(dict) {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.dataset.i18nAriaLabel;
      if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });
  }
  // Expose so any later-injected partial (e.g. cookie banner) can re-translate.
  window.applyTranslations = applyDict;

  function initLang() {
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.addEventListener('click', () => setLang(b.dataset.lang));
    });
    const saved = localStorage.getItem('lang') || 'en';
    setLang(saved);
  }

  function setLang(lang) {
    if (!['en', 'th', 'da'].includes(lang)) lang = 'en';
    document.querySelectorAll('.lang-switch button').forEach(b => {
      b.setAttribute('aria-pressed', b.dataset.lang === lang ? 'true' : 'false');
    });
    document.documentElement.lang = lang === 'th' ? 'th' : (lang === 'da' ? 'da' : 'en');
    localStorage.setItem('lang', lang);

    // Apply passport-specific keys first (inline fallback for the few elements
    // that the JSON dictionaries don't yet cover for all 3 langs).
    if (I18N[lang]) applyDict(I18N[lang]);

    // Then fetch the canonical lang/<lang>.json and overlay.
    if (langCache[lang]) { applyDict(langCache[lang]); return; }
    fetch(LANG_URL(lang))
      .then(r => r.ok ? r.json() : null)
      .then(dict => { if (dict) { langCache[lang] = dict; applyDict(dict); } })
      .catch(() => { /* offline / 404 — inline fallback already applied */ });
  }

  /* ───── MOBILE MENU ───── */
  function initMenu() {
    const btn = document.getElementById('menu-btn');
    const sheet = document.getElementById('menu-sheet');
    const close = document.getElementById('menu-close');
    if (!btn || !sheet) return;
    const open = () => { sheet.classList.add('open'); sheet.setAttribute('aria-hidden', 'false'); btn.setAttribute('aria-expanded', 'true'); };
    const shut = () => { sheet.classList.remove('open'); sheet.setAttribute('aria-hidden', 'true'); btn.setAttribute('aria-expanded', 'false'); };
    btn.addEventListener('click', open);
    close?.addEventListener('click', shut);
    sheet.querySelectorAll('a').forEach(a => a.addEventListener('click', shut));
  }

  /* ───── TWEAKS PANEL ───── */
  function initTweaks() {
    const panel = document.getElementById('tweaks');
    if (!panel) return;

    // Accent swatches
    const savedAccent = localStorage.getItem('accent') || '#D17B3F';
    applyAccent(savedAccent);
    document.querySelectorAll('#accent-swatches .swatch').forEach(s => {
      if (s.dataset.accent === savedAccent) s.classList.add('active');
      s.addEventListener('click', () => {
        document.querySelectorAll('#accent-swatches .swatch').forEach(x => x.classList.remove('active'));
        s.classList.add('active');
        applyAccent(s.dataset.accent);
        postEdit({ accent: s.dataset.accent });
      });
    });

    // Theme segmented
    document.querySelectorAll('#theme-seg button').forEach(b => {
      b.addEventListener('click', () => { setTheme(b.dataset.theme); postEdit({ theme: b.dataset.theme }); });
    });

    // Bilingual segmented (controls passport field bilingual display)
    const savedBilingual = localStorage.getItem('bilingual') || 'both';
    applyBilingual(savedBilingual);
    document.querySelectorAll('#bilingual-seg button').forEach(b => {
      if (b.dataset.bilingual === savedBilingual) b.setAttribute('aria-pressed', 'true');
      b.addEventListener('click', () => {
        document.querySelectorAll('#bilingual-seg button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        applyBilingual(b.dataset.bilingual);
        postEdit({ bilingual: b.dataset.bilingual });
      });
    });

    // Background segmented
    const savedBg = localStorage.getItem('bg') || 'grain';
    applyBg(savedBg);
    document.querySelectorAll('#bg-seg button').forEach(b => {
      if (b.dataset.bg === savedBg) b.setAttribute('aria-pressed', 'true');
      else b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', () => {
        document.querySelectorAll('#bg-seg button').forEach(x => x.setAttribute('aria-pressed', 'false'));
        b.setAttribute('aria-pressed', 'true');
        applyBg(b.dataset.bg);
        postEdit({ bg: b.dataset.bg });
      });
    });

    // Close
    document.getElementById('tweaks-close')?.addEventListener('click', () => {
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden', 'true');
      try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch (e) {}
    });

    // Host bridge
    window.addEventListener('message', e => {
      if (!e.data) return;
      if (e.data.type === '__activate_edit_mode') {
        panel.classList.add('open');
        panel.setAttribute('aria-hidden', 'false');
      } else if (e.data.type === '__deactivate_edit_mode') {
        panel.classList.remove('open');
        panel.setAttribute('aria-hidden', 'true');
      }
    });
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch (e) {}
  }
  function applyAccent(color) {
    document.documentElement.style.setProperty('--accent', color);
    localStorage.setItem('accent', color);
  }
  function applyBilingual(mode) {
    document.querySelectorAll('.pp-field .k').forEach(k => {
      const en = k.querySelector('span:not(em)') || k.firstElementChild;
      const th = k.querySelector('em');
      if (!en || !th) return;
      if (mode === 'both') { en.style.display = ''; th.style.display = ''; }
      else if (mode === 'en') { en.style.display = ''; th.style.display = 'none'; }
      else if (mode === 'th') { en.style.display = 'none'; th.style.display = ''; }
    });
    localStorage.setItem('bilingual', mode);
  }
  function applyBg(mode) {
    document.body.dataset.bg = mode;
    localStorage.setItem('bg', mode);
  }
  function postEdit(edits) {
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch (e) {}
  }

  /* ───── SCROLL SPY (highlight nav) ───── */
  function initScrollSpy() {
    const links = document.querySelectorAll('.nav-links a');
    if (!links.length) return;
    const sections = [...links].map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
    const onScroll = () => {
      const y = window.scrollY + 100;
      let active = null;
      sections.forEach(s => { if (s.offsetTop <= y) active = s.id; });
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + active));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ───── INIT ───── */
  document.addEventListener('DOMContentLoaded', () => {
    renderTimelineSVG();
    renderTimelineMobile();
    initTheme();
    initLang();
    initMenu();
    initTweaks();
    initScrollSpy();
  });

})();
