// ---------- Flip Card ----------
function setupFlipCards() {
    document.querySelectorAll(".flip-card").forEach(card => {
        // Click flips the card
        card.addEventListener("click", () => card.classList.toggle("flipped"));

        // Keyboard flip: Enter or Space
        card.addEventListener("keydown", e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // prevent scrolling for Space
                card.classList.toggle("flipped");
            }
        });

        // Random rotation/animation for style
        const duration = 5 + Math.random() * 4;
        const initialZ = (Math.random() - 0.5) * 4;
        card.style.transform = `rotateZ(${initialZ}deg)`;
        card.style.animationDuration = `${duration}s`;
    });
}

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

        // Optional hover effect
        entry.addEventListener("mouseenter", () => entry.classList.add("scale-110"));
        entry.addEventListener("mouseleave", () => entry.classList.remove("scale-110"));
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {

    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    // Non-critical background tasks
    ric(() => {
        setupFlipCards();
        setupTimelineEntries();
    });

    timelinePresent();
});