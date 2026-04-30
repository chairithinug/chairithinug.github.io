// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch('/articles/post-footer.html')
        .then(res => res.text())
        .then(html => {
            const container = document.getElementById('post-footer-container');
            if (!container) return;
            container.innerHTML = html;

            const lang = localStorage.getItem("lang");
            if (lang && lang !== "en") {
                fetch(`/lang/${lang}.json`)
                    .then(r => r.json())
                    .then(data => window.applyTranslations?.(data))
                    .catch(err => console.error("post-footer translation failed:", err));
            }
        });
});
