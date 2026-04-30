// ---------- Timeline ----------
function timelinePresent() {
    const marker = document.getElementById("current-date-marker");
    marker.textContent = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long" });
}

// ---------- Timeline Entry Flip & Hover ----------
function setupTimelineEntries() {
    const entries = document.querySelectorAll('.timeline-entry');
    entries.forEach((entry, i) => {
        entry.classList.add(i % 2 === 0 ? 'left' : 'right');

        entry.addEventListener("mouseenter", () => entry.classList.add("scale-110"));
        entry.addEventListener("mouseleave", () => entry.classList.remove("scale-110"));
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
