// ---------- Cookies & Analytics ----------
function setupCookies() {
    const overlay = document.getElementById("cookie-overlay");
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    const hideBanner = () => {
        overlay.style.display = "none";
        banner.style.display = "none";
    };

    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "accepted" || cookieConsent === "rejected") hideBanner();

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        hideBanner();
        loadAnalytics();
    });

    rejectBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "rejected");
        hideBanner();
    });
}

// ---------- Google Analytics Loader ----------
function loadAnalytics() {
    if (localStorage.getItem("analytics-consent") === "true") return;

    localStorage.setItem("analytics-consent", "true");
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-FJQNSE4GQC";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-FJQNSE4GQC', { 'anonymize_ip': true });
    trackLinks();
}

// Only call this after user accepts cookies
function trackLinks() {
    const links = [
        { selector: 'a[href*="linkedin.com"]', label: "LinkedIn" },
        { selector: 'a[href*="strava.com"]', label: "Strava" },
        { selector: 'a[href*="Anapat_Chairithinugull_Resume_polished.pdf"]', label: "Resume" },
        { selector: 'a[href*="ATS_friendly_Anapat_Chairithinugull.pdf"]', label: "ATS Friendly Resume" }
    ];

    links.forEach(link => {
        const element = document.querySelector(link.selector);
        if (!element) return;

        element.addEventListener("click", () => {
            gtag('event', 'click', {
                event_category: 'Link',
                event_label: link.label
            });
        });
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch('/partials/footer.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('footer-container').innerHTML = html;
            setupCookies();
        });
});