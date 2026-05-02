// ---------- PWA install prompt ----------
// Hooks the beforeinstallprompt event (Chrome/Edge/Android) and falls back to a
// brief "Add to Home Screen" instruction sheet for iOS Safari, where the API
// isn't available. Saves dismissals/installs in localStorage so we don't pester
// the same visitor repeatedly.
(function () {
    const STORAGE_KEY = 'pwa-install-dismissed-until';
    const DISMISS_DAYS = 14;

    function isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches
            || window.navigator.standalone === true; // iOS Safari
    }

    function isDismissed() {
        try {
            const until = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
            return until > Date.now();
        } catch (e) { return false; }
    }

    function setDismissed() {
        try {
            localStorage.setItem(STORAGE_KEY, String(Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000));
        } catch (e) { /* ignore */ }
    }

    function isIos() {
        return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
    }

    // Already installed → never show
    if (isStandalone()) return;

    let deferredPrompt = null;

    // Build the install button
    function makeButton() {
        const btn = document.createElement('button');
        btn.id = 'pwa-install-btn';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Install this site as an app');
        btn.setAttribute('data-i18n-aria-label', 'aria-install-app');
        // Position + z-index live in custom.css (#pwa-install-btn) so the
        // arbitrary z-60 / bottom-[6rem] don't depend on Tailwind picking up
        // values out of JS strings. Tailwind utilities below are layout-only.
        btn.className = [
            'fixed', 'right-4',
            'min-h-[44px]', 'px-4', 'py-2', 'rounded-full',
            'bg-blue-600', 'hover:bg-blue-700', 'text-white', 'text-sm', 'font-semibold',
            'shadow-lg', 'transition-opacity', 'duration-300',
            'focus:outline-2', 'focus:outline-blue-300', 'focus:outline-offset-2',
            'flex', 'items-center', 'gap-2',
            'hidden',
        ].join(' ');
        btn.innerHTML = [
            '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">',
            '<path d="M12 3v12m0 0l-4-4m4 4l4-4"/><path d="M5 21h14"/>',
            '</svg>',
            '<span data-i18n="install-app">Install app</span>',
        ].join('');
        // Dismiss with right-click / long-press is unreliable; provide a small × button
        const close = document.createElement('button');
        close.type = 'button';
        // Position + z-index in custom.css (#pwa-install-dismiss); these are layout-only
        close.className = 'fixed right-2 w-6 h-6 rounded-full bg-gray-700 text-white text-xs leading-6 text-center hidden';
        close.id = 'pwa-install-dismiss';
        close.setAttribute('aria-label', 'Dismiss install prompt');
        close.setAttribute('data-i18n-aria-label', 'aria-dismiss-install');
        close.textContent = '×';
        close.addEventListener('click', () => {
            setDismissed();
            btn.classList.add('hidden');
            close.classList.add('hidden');
        });
        document.body.appendChild(btn);
        document.body.appendChild(close);
        return { btn, close };
    }

    function isCookieBannerVisible() {
        const banner = document.getElementById('cookie-banner');
        if (!banner) return false;
        // Banner is "inert" + display:none after consent decided
        return !banner.hasAttribute('inert');
    }

    function init() {
        if (isDismissed()) return;
        const { btn, close } = makeButton();

        // Hide install UI whenever the cookie banner is in the way; re-check
        // periodically so we surface the install prompt as soon as the user
        // dismisses the cookie banner.
        function syncWithCookieBanner() {
            if (isCookieBannerVisible()) {
                btn.dataset.suppressed = 'cookie';
                btn.classList.add('hidden');
                close.classList.add('hidden');
            } else if (btn.dataset.suppressed === 'cookie') {
                delete btn.dataset.suppressed;
                if (deferredPrompt || isIos()) {
                    btn.classList.remove('hidden');
                    close.classList.remove('hidden');
                }
            }
        }
        // Re-check every 500ms — cheap, no MutationObserver setup, fine for a
        // one-time interaction that resolves within seconds.
        const cookieWatcher = setInterval(syncWithCookieBanner, 500);
        window.addEventListener('pagehide', () => clearInterval(cookieWatcher));

        // Re-translate the new elements if a non-English language is active
        try {
            const lang = localStorage.getItem('lang');
            if (lang && lang !== 'en') {
                fetch(`/lang/${lang}.json`).then(r => r.json()).then(data => {
                    if (typeof window.applyTranslations === 'function') {
                        window.applyTranslations(data);
                    } else {
                        // Fallback: apply minimally
                        const txt = btn.querySelector('[data-i18n="install-app"]');
                        if (txt && data['install-app']) txt.textContent = data['install-app'];
                        if (data['aria-install-app']) btn.setAttribute('aria-label', data['aria-install-app']);
                        if (data['aria-dismiss-install']) close.setAttribute('aria-label', data['aria-dismiss-install']);
                    }
                }).catch(() => {});
            }
        } catch (e) { /* ignore */ }

        // Chrome/Edge/Android path
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            btn.classList.remove('hidden');
            close.classList.remove('hidden');
        });

        btn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const choice = await deferredPrompt.userChoice;
                deferredPrompt = null;
                btn.classList.add('hidden');
                close.classList.add('hidden');
                if (choice.outcome !== 'accepted') setDismissed();
            } else if (isIos()) {
                // iOS: show a small modal with instructions
                showIosInstructions();
            }
        });

        // iOS Safari fallback: show button after a delay (no beforeinstallprompt support)
        if (isIos()) {
            // Heuristic: show after 5s if not already standalone
            setTimeout(() => {
                if (!isStandalone() && !isDismissed()) {
                    btn.classList.remove('hidden');
                    close.classList.remove('hidden');
                }
            }, 5000);
        }

        // Hide button + cleanup if user installed via OS-native UI later
        window.addEventListener('appinstalled', () => {
            btn.classList.add('hidden');
            close.classList.add('hidden');
            try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
        });
    }

    function showIosInstructions() {
        // Stash the trigger so we can restore focus on close — required for
        // screen-reader users so they don't lose context after dismissing.
        const previouslyFocused = document.activeElement;

        const overlay = document.createElement('div');
        overlay.className = 'fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-modal', 'true');
        overlay.setAttribute('aria-labelledby', 'ios-install-title');
        const card = document.createElement('div');
        card.className = 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl max-w-sm w-full p-6 space-y-4';
        card.innerHTML = `
          <h2 id="ios-install-title" class="text-lg font-bold" data-i18n="ios-install-title">Install on iOS</h2>
          <ol class="list-decimal list-inside text-sm space-y-2">
            <li data-i18n="ios-install-step-1">Tap the Share button in Safari.</li>
            <li data-i18n="ios-install-step-2">Choose “Add to Home Screen”.</li>
            <li data-i18n="ios-install-step-3">Tap “Add” in the top-right corner.</li>
          </ol>
          <button type="button" id="ios-install-close"
            class="w-full px-4 py-2 min-h-[44px] rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            data-i18n="ios-install-got-it"
            aria-label="Got it">Got it</button>
        `;
        overlay.appendChild(card);

        // close({ dismiss: true }) is "I read it, don't ask again for 14 days".
        // close({ dismiss: false }) is "close for now" (Escape / click backdrop).
        function close({ dismiss }) {
            overlay.remove();
            document.removeEventListener('keydown', onKeydown);
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                previouslyFocused.focus();
            }
            if (dismiss) setDismissed();
        }

        function onKeydown(e) {
            if (e.key === 'Escape') {
                e.preventDefault();
                close({ dismiss: false });
                return;
            }
            if (e.key !== 'Tab') return;
            // Trap focus inside the dialog. Currently the only focusable
            // element is the "Got it" button, so Tab just keeps focus on it.
            const focusables = card.querySelectorAll('button, [href], input, [tabindex]:not([tabindex="-1"])');
            if (!focusables.length) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }

        overlay.addEventListener('click', (e) => { if (e.target === overlay) close({ dismiss: false }); });
        card.querySelector('#ios-install-close').addEventListener('click', () => close({ dismiss: true }));
        document.addEventListener('keydown', onKeydown);
        document.body.appendChild(overlay);

        // Move focus into the dialog so screen readers announce it and Tab
        // navigation starts inside the trap, not back on the install button.
        const closeBtn = card.querySelector('#ios-install-close');
        if (closeBtn) closeBtn.focus();

        // Translate the new dialog if non-English
        try {
            const lang = localStorage.getItem('lang');
            if (lang && lang !== 'en') {
                fetch(`/lang/${lang}.json`).then(r => r.json()).then(data => {
                    if (typeof window.applyTranslations === 'function') {
                        window.applyTranslations(data);
                    }
                }).catch(() => {});
            }
        } catch (e) {}
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
