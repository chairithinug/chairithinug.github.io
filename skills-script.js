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

    let touchStartX = 0;
    let touchScrollLeft = 0;

    carousel.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchScrollLeft = carousel.scrollLeft;
    }, { passive: true });

    carousel.addEventListener('touchmove', e => {
        const walk = (touchStartX - e.touches[0].clientX) * 1.5;
        carousel.scrollLeft = touchScrollLeft + walk;
        e.preventDefault();
    }, { passive: false });

    carousel.addEventListener('touchend', () => {});
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    setupCarousel('carousel', 'left-arrow', 'right-arrow', 260);
});