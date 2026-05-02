// ---------- Timeline ----------
function timelinePresent() {
    const marker = document.getElementById("current-date-marker");
    marker.textContent = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" });
}

// ---------- Timeline left/right alternation ----------
// Hover/focus scale lives in CSS (`.timeline-entry:hover, :focus-visible`)
// so keyboard users get the same effect mouse users do.
function setupTimelineEntries() {
    document.querySelectorAll('.timeline-entry').forEach((entry, i) => {
        entry.classList.add(i % 2 === 0 ? 'left' : 'right');
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    ric(() => {
        setupFlipCards();
        setupTimelineEntries();
    });

    timelinePresent();
});
