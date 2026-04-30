// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    ric(() => {
        setupFlipCards();
    });
});
