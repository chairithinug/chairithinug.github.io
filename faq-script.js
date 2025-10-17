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

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {

    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };

    // Non-critical background tasks
    ric(() => {
        setupFlipCards();
    });
});