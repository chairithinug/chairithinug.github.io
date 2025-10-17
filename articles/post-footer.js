// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch('/articles/post-footer.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('post-footer-container').innerHTML = html;
            setupCookies();
        });
});