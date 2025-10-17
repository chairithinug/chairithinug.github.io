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

// ---------- Carousel Generic ----------
function setupCarousel(carouselId, leftBtnId, rightBtnId, scrollAmount) {
    const carousel = document.getElementById(carouselId);
    const leftBtn = document.getElementById(leftBtnId);
    const rightBtn = document.getElementById(rightBtnId);

    let isDown = false, startX, scrollLeft;

    leftBtn.addEventListener("click", () => carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" }));
    rightBtn.addEventListener("click", () => carousel.scrollBy({ left: scrollAmount, behavior: "smooth" }));

    carousel.addEventListener("mousedown", e => {
        isDown = true;
        carousel.classList.add("cursor-grabbing");
        startX = e.pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener("mouseleave", () => { isDown = false; carousel.classList.remove("cursor-grabbing"); });
    carousel.addEventListener("mouseup", () => { isDown = false; carousel.classList.remove("cursor-grabbing"); });
    carousel.addEventListener("mousemove", e => {
        if (!isDown) return;
        e.preventDefault();
        const walk = (e.pageX - startX) * 2;
        carousel.scrollLeft = scrollLeft - walk;
    });

    carousel.addEventListener('keydown', e => {
        const scrollAmount = 100; // pixels per key press
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        }
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    setupCarousel('sports-carousel', 'left-sports', 'right-sports', 220);
});