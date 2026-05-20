// Tag filter. Uses a dedicated .is-filtered-out class with display:none!important
// (rather than the hidden attribute) so CSS specificity from .proj-card { display: flex }
// can never override it.
(() => {
  try {
    const chips = document.querySelectorAll('#filter-bar .filter-chip');
    const cards = Array.from(document.querySelectorAll('#proj-grid .proj-card'));
    const empty = document.getElementById('proj-empty');
    if (!chips.length || !cards.length) return;

    const tagsOf = (card) => (card.dataset.tags || '').trim().split(/\s+/);

    const countFor = (tag) => tag === 'all'
      ? cards.length
      : cards.filter(c => tagsOf(c).includes(tag)).length;

    // Stamp dynamic counts onto each chip ('All · 10', 'AI / ML · 5', etc.)
    chips.forEach(c => {
      const n = countFor(c.dataset.tag);
      c.textContent = `${c.dataset.label} · ${n}`;
      if (n === 0) c.disabled = true;
    });

    const applyFilter = (tag) => {
      let visible = 0;
      cards.forEach(card => {
        const show = tag === 'all' || tagsOf(card).includes(tag);
        card.classList.toggle('is-filtered-out', !show);
        if (show) visible++;
      });
      if (empty) empty.classList.toggle('is-filtered-out', visible > 0);
    };

    chips.forEach(c => c.addEventListener('click', () => {
      chips.forEach(x => x.classList.remove('active'));
      c.classList.add('active');
      applyFilter(c.dataset.tag);
    }));
  } catch (e) {
    console.error('[projects-filter.js] init failed:', e);
  }
})();
