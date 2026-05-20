// FAQ cards generated from a single source. Per-card markup was 11 × 14 lines
// of repetitive HTML; this is the same data in 3 lines per row.
// data-i18n keys still work because applyDict() runs after this generator
// and overwrites .q / .a textContent.
const FAQ = [
  { q: "Where are you originally from?", a: "I was born and raised in Thailand — a beautiful country with amazing food in Southeast Asia." },
  { q: "Why did you study in the US?", a: "Thanks to my family who were willing to send me to the US. It was a great experience. UW–Madison is awesome." },
  { q: "What brought you to Denmark?", a: "After a few years working in Thailand I wanted a change of scenery, so I packed up for Europe. Denmark ended up choosing me — finished my MSc at UCPH and moved back home in early 2026." },
  { q: "Cool website! How did you make it?", a: "Plain HTML, vanilla JS, and IBM Plex — plus plenty of help from Claude Code along the way." },
  { q: "Are you a robot?", a: "No, I'm human. At least I think so. Are you?" },
  { q: "What are you doing now?", a: "Looking for new opportunities in Thailand. In the meantime I'm authoring Claude AI Skills, building Natty (a SvelteKit badminton scheduler), and tinkering with this site. Are you hiring?" },
  { q: "How can I contact you?", a: "Easiest is to drop me an email or message me on LinkedIn — both are linked at the top of every page." },
  { q: "What kind of role are you looking for?", a: "Data Scientist, AI Engineer, or ML Engineer — any of those titles work. I'm not picky about the industry; what I want is something impactful and meaningful. Most skills are transferable, and I'm always up for learning whatever the role needs." },
  { q: "What's your favorite tech stack right now?", a: "Hooked on the Claude family — Cowork, Code, and Design — and getting comfortable with Svelte/SvelteKit on the Natty side project. Equal parts AI tooling and modern web." },
  { q: "What do you do outside of coding?", a: "Coffee and endurance sports — running, swimming, biking. Lately badminton too, which is exactly why I'm building Natty to schedule sessions with friends." },
  { q: "Open to remote work or relocation?", a: "Hybrid is great, full remote less so — tried it during Covid and didn't love it. Just moved back to Bangkok so I'm not relocating right now, but a visa-friendly move down the road isn't off the table. I really enjoy multicultural teams." }
];

(() => {
  try {
    const grid = document.getElementById('faq-grid');
    if (!grid) return;

    grid.innerHTML = FAQ.map((row, i) => {
      const n = i + 1;
      const nn = String(n).padStart(2, '0');
      return `
        <button class="faq-card" type="button">
          <div class="faq-inner">
            <div class="faq-side front">
              <div class="num">Q · ${nn}</div>
              <p class="q" data-i18n="faq-q-${n}"></p>
              <div class="hint">Tap to flip ↺</div>
            </div>
            <div class="faq-side back" data-acode="A · ${nn}">
              <p class="a" data-i18n="faq-a-${n}"></p>
              <div class="hint">↺ Flip back</div>
            </div>
          </div>
        </button>`;
    }).join('');

    // Inject the default-language text (overwritten by site.js applyDict if a non-EN lang is active)
    grid.querySelectorAll('.faq-card').forEach((card, i) => {
      card.querySelector('.q').textContent = FAQ[i].q;
      card.querySelector('.a').textContent = FAQ[i].a;
    });

    // Flip behavior — click anywhere; keyboard Enter/Space works since it's a <button>.
    // Manages aria-expanded + announces the answer in the accessible name when open.
    grid.querySelectorAll('.faq-card').forEach(card => {
      const readQ = () => card.querySelector('.q')?.textContent?.trim() || '';
      const readA = () => card.querySelector('.a')?.textContent?.trim() || '';
      const sync = () => {
        const open = card.classList.contains('flipped');
        card.setAttribute('aria-expanded', open ? 'true' : 'false');
        card.setAttribute('aria-label', open ? `${readQ()} — Answer: ${readA()}` : readQ());
      };
      sync();
      card.addEventListener('click', () => {
        card.classList.toggle('flipped');
        sync();
      });
    });
  } catch (e) {
    console.error('[faq-cards.js] init failed:', e);
  }
})();
