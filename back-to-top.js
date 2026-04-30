// ---------- Back-to-top button (long pages) + auto reading-time (articles) ----------
(function () {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- Back-to-top button ----
    function setupBackToTop() {
        const btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Back to top');
        btn.setAttribute('data-i18n-aria-label', 'aria-back-to-top');
        btn.className = [
            'fixed', 'bottom-20', 'right-4', 'z-50', 'hidden',
            'min-w-[44px]', 'min-h-[44px]', 'p-3', 'rounded-full',
            'bg-blue-600', 'hover:bg-blue-700', 'text-white',
            'shadow-lg', 'transition-opacity', 'duration-300',
            'focus:outline-2', 'focus:outline-blue-300', 'focus:outline-offset-2',
            'flex', 'items-center', 'justify-center',
        ].join(' ');
        // SVG up-arrow icon
        btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 15l7-7 7 7"/></svg>';
        document.body.appendChild(btn);

        let visible = false;
        // Threshold caps at 600 px on long pages but scales down to 50 % of
        // available scroll on shorter pages so the button still surfaces.
        const computeThreshold = () => {
            const scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            return Math.min(600, scrollable * 0.5);
        };
        let threshold = computeThreshold();
        const update = () => {
            const shouldShow = scrollable() && window.scrollY > threshold;
            if (shouldShow && !visible) { btn.classList.remove('hidden'); visible = true; }
            else if (!shouldShow && visible) { btn.classList.add('hidden'); visible = false; }
        };
        // Hide entirely if the page can't scroll meaningfully (e.g. < 200 px).
        function scrollable() {
            return (document.documentElement.scrollHeight - window.innerHeight) > 200;
        }
        const recompute = () => { threshold = computeThreshold(); update(); };
        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', recompute, { passive: true });
        // Recompute once after the dynamic partials (sidebar/footer) and async
        // images settle, since they change scrollHeight.
        window.addEventListener('load', recompute);
        update();

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
            // Move focus back to top so keyboard users don't lose place
            const skipLink = document.querySelector('a[href="#main-content"]');
            if (skipLink) skipLink.focus({ preventScroll: true });
        });
    }

    // ---- Auto reading-time for articles ----
    function setupReadingTime() {
        const el = document.getElementById('reading-time');
        if (!el) return;
        const article = document.querySelector('article');
        if (!article) return;
        const words = article.textContent.trim().split(/\s+/).length;
        const minutes = Math.max(1, Math.ceil(words / 225));
        // Translatable: read fallback EN here; data-i18n-* would re-write it after switch
        el.textContent = minutes + ' min read';
        el.setAttribute('data-reading-minutes', String(minutes));
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => { setupBackToTop(); setupReadingTime(); });
    } else {
        setupBackToTop();
        setupReadingTime();
    }
})();
