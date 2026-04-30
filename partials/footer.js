// ---------- Cookies & Analytics ----------
function setupCookies() {
    const overlay = document.getElementById("cookie-overlay");
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    if (!banner || !overlay) return;

    // Helpers to show/hide overlay + banner
    const showOverlay = () => {
        overlay.hidden = false;
    };
    const hideOverlay = () => {
        overlay.hidden = true;
    };

    const showBanner = () => {
        banner.removeAttribute("inert");
        banner.style.display = "flex"; // Ensure the banner is visible
        banner.setAttribute("tabindex", "-1");
        banner.focus();
        showOverlay();
    };
    const hideBanner = () => {
        banner.setAttribute("inert", "");
        banner.style.display = "none"; // Hide the banner
        hideOverlay();
    };

    // Detect storage availability up-front so we can warn the user that their
    // choice won't persist across sessions if storage is blocked.
    let storageAvailable = true;
    try {
        const testKey = '__cookie_storage_test__';
        localStorage.setItem(testKey, '1');
        localStorage.removeItem(testKey);
    } catch (e) {
        storageAvailable = false;
        console.warn("localStorage unavailable; cookie consent won't persist:", e);
    }

    // In-memory consent state used as a fallback when storage is blocked. Only
    // good for the current page session, but at least the banner won't keep
    // reappearing on every action within the same view.
    let sessionConsent = null;

    const readConsent = () => {
        if (!storageAvailable) return sessionConsent;
        try { return localStorage.getItem("cookieConsent"); }
        catch (e) { return sessionConsent; }
    };
    const writeConsent = (value) => {
        sessionConsent = value;
        if (!storageAvailable) return;
        try { localStorage.setItem("cookieConsent", value); }
        catch (e) { storageAvailable = false; renderStorageNotice(); }
    };

    // Inline notice slot inside the banner: appears when storage is blocked.
    const renderStorageNotice = () => {
        if (storageAvailable) return;
        if (banner.querySelector('.cookie-storage-notice')) return;
        const notice = document.createElement('div');
        notice.className = 'cookie-storage-notice text-xs text-amber-700 dark:text-amber-300 mt-2 w-full';
        notice.setAttribute('data-i18n', 'cookie-storage-warning');
        notice.textContent = 'Note: your browser is blocking storage, so this choice will not persist after you close the tab.';
        banner.appendChild(notice);
        // Translate immediately if a non-English language is active
        try {
            const lang = localStorage.lang;
            if (lang && lang !== 'en' && typeof window.applyTranslations === 'function') {
                fetch(`/lang/${lang}.json`).then(r => r.json()).then(window.applyTranslations).catch(() => {});
            }
        } catch (e) { /* ignore */ }
    };

    // Read existing consent
    const cookieConsent = readConsent();

    // If consent already given, hide both
    if (cookieConsent === "accepted" || cookieConsent === "rejected") {
        hideBanner();
    } else {
        // No consent yet -> ensure banner + overlay visible
        showBanner();
        renderStorageNotice();
    }

    // Event listeners for buttons
    acceptBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        writeConsent("accepted");
        hideBanner();
        loadAnalytics();
    });

    rejectBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        writeConsent("rejected");
        hideBanner();
    });

    // Trap focus within the banner when visible
    banner.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            hideBanner();
        } else if (e.key === "Tab") {
            const focusableElements = banner.querySelectorAll("button");
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });

    // Prevent overlay clicks from closing the banner
    overlay.addEventListener("click", (e) => {
        e.stopPropagation();
    });
}

// ---------- Google Analytics Loader ----------
function loadAnalytics() {
    // Only fire when the user has explicitly accepted cookies
    if (localStorage.getItem("cookieConsent") !== "accepted") return;
    // Prevent double-injection on repeat calls
    if (document.getElementById("ga-script")) return;

    const script = document.createElement("script");
    script.id = "ga-script";
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-FJQNSE4GQC";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
        window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", "G-FJQNSE4GQC", { anonymize_ip: true });
    trackLinks();
}

// Only call this after user accepts cookies
function trackLinks() {
    const links = [
        { selector: 'a[href*="linkedin.com"]', label: "LinkedIn" },
        { selector: 'a[href*="strava.com"]', label: "Strava" },
        { selector: 'a[href*="Anapat_Chairithinugull_Resume_polished.pdf"]', label: "Resume" },
        { selector: 'a[href*="ATS_friendly_Anapat_Chairithinugull.pdf"]', label: "ATS Friendly Resume" },
        { selector: 'a[href*="articles.html"]', label: "Articles" },
        { selector: 'a[href*="career.html"]', label: "Career" },
        { selector: 'a[href*="faq.html"]', label: "FAQ" },
        { selector: 'a[href*="index.html"]', label: "Home" },
        { selector: 'a[href*="interests.html"]', label: "Interests" },
        { selector: 'a[href*="projects.html"]', label: "Projects" },
        { selector: 'a[href*="skills.html"]', label: "Skills" },
    ];

    if (typeof window.gtag !== "function") return;

    links.forEach((link) => {
        document.querySelectorAll(link.selector).forEach((element) => {
            element.addEventListener("click", () => {
                try {
                    window.gtag("event", "click", {
                        event_category: "Link",
                        event_label: link.label,
                    });
                } catch (e) {
                    console.error("Error tracking link click:", e);
                }
            });
        });
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch("/partials/footer.html")
        .then((res) => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
        })
        .then((html) => {
            const container = document.getElementById("footer-container");
            if (!container) return;
            container.innerHTML = html;

            // Move overlay + banner to document.body to avoid stacking-context issues
            try {
                const overlay = document.getElementById("cookie-overlay");
                const banner = document.getElementById("cookie-banner");
                if (overlay) document.body.appendChild(overlay);
                if (banner) document.body.appendChild(banner);
            } catch (e) {
                console.error("Error moving cookie banner/overlay:", e);
            }

            setupCookies();
            loadAnalytics(); // fires immediately for returning visitors who already accepted
        })
        .catch((err) => {
            console.error("Failed to load footer partial:", err);
            if (typeof window.showPartialError === 'function') {
                window.showPartialError('footer-container', 'footer');
            }
        });
});