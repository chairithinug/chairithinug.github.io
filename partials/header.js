// ---------- Dark Mode Toggle ----------
function darkMode() {
    const toggle = document.getElementById("dark-toggle");
    const thumb = document.getElementById("dark-toggle-thumb");

    // The inline init script in <head> already sets the .dark class on <html>
    // based on localStorage.theme + system preference. We just sync the toggle
    // and add the click handler.
    const isDark = document.documentElement.classList.contains("dark");
    if (thumb) thumb.classList.toggle("translate-x-6", isDark);

    if (toggle) {
        toggle.addEventListener("click", () => {
            const dark = document.documentElement.classList.toggle("dark");
            if (thumb) thumb.classList.toggle("translate-x-6");
            localStorage.theme = dark ? "dark" : "light";
        });
    }
}

// ---------- Language ----------
function applyTranslations(data) {
    // Pass 1: text content via data-i18n="key"
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (data[key] !== undefined) el.textContent = data[key];
    });
    // Pass 2: aria-label via data-i18n-aria-label="key"
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.dataset.i18nAriaLabel;
        if (data[key] !== undefined) el.setAttribute('aria-label', data[key]);
    });
    // Pass 3: title attribute via data-i18n-title="key"
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        if (data[key] !== undefined) el.setAttribute('title', data[key]);
    });
    // Pass 4: backward-compat — translate elements whose id matches a key,
    // unless they already opted into the data-i18n attribute system.
    Object.keys(data).forEach(key => {
        const el = document.getElementById(key);
        if (el && !el.hasAttribute('data-i18n')) el.textContent = data[key];
    });
}

function loadLanguage(lang) {
    return fetch(`/lang/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            applyTranslations(data);
            try { localStorage.lang = lang; } catch (e) {}
            document.documentElement.lang = lang;
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.setAttribute('aria-current', btn.dataset.lang === lang ? 'true' : 'false');
            });
            return data;
        })
        .catch(() => null);
}

// Re-apply current language after dynamically-injected partials (sidebar) land.
function retranslateAfterPartials() {
    const lang = (() => { try { return localStorage.lang; } catch (e) { return null; } })();
    if (!lang || lang === "en") return;
    setTimeout(() => {
        fetch(`/lang/${lang}.json`).then(r => r.json()).then(applyTranslations).catch(() => {});
    }, 300);
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch('/partials/header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            darkMode();
            document.querySelectorAll(".lang-btn").forEach(btn =>
                btn.addEventListener("click", () => loadLanguage(btn.dataset.lang))
            );
            const savedLang = (() => { try { return localStorage.lang; } catch (e) { return null; } })();
            if (savedLang && savedLang !== "en") loadLanguage(savedLang);
            retranslateAfterPartials();
        });
});
