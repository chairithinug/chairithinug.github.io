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

    // Read existing consent safely
    let cookieConsent = null;
    try {
        cookieConsent = localStorage.getItem("cookieConsent");
    } catch (e) {
        console.error("Error reading cookie consent from localStorage:", e);
    }

    // If consent already given, hide both
    if (cookieConsent === "accepted" || cookieConsent === "rejected") {
        hideBanner();
    } else {
        // No consent yet -> ensure banner + overlay visible
        showBanner();
    }

    // Event listeners for buttons
    acceptBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        try {
            localStorage.setItem("cookieConsent", "accepted");
        } catch (err) {
            console.error("Error saving cookie consent to localStorage:", err);
        }
        hideBanner();
        loadAnalytics();
    });

    rejectBtn?.addEventListener("click", (e) => {
        e.stopPropagation();
        try {
            localStorage.setItem("cookieConsent", "rejected");
        } catch (err) {
            console.error("Error saving cookie consent to localStorage:", err);
        }
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

    links.forEach((link) => {
        const element = document.querySelector(link.selector);
        if (!element || typeof window.gtag !== "function") return;

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
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch("/partials/footer.html")
        .then((res) => res.text())
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
        });
});