// ---------- Countdown ----------
function updateCountdowns() {
    const countdowns = document.querySelectorAll(".countdown");
    const now = Date.now();

    countdowns.forEach(el => {
        const eventDate = new Date(el.dataset.date).getTime();
        const diff = eventDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / 86400000);
            const hours = Math.floor((diff % 86400000) / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);

            el.textContent = `⏳ ${days}d ${hours}h ${minutes}m ${seconds}s left`;
        } else {
            el.textContent = "🎉 Event has started!";
        }
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    updateCountdowns();
    const countdownInterval = setInterval(updateCountdowns, 1000);
    window.addEventListener('pagehide', () => clearInterval(countdownInterval));
    setupCarousel('sports-carousel', 'left-sports', 'right-sports', 220);
});
