// import '/dist/main.css';

// ---------- Utility ----------
const random = (min, max) => Math.random() * (max - min) + min;

// ---------- Blob Background ----------
function blobBackground() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = [
        "#FBB6CE", "#BFDBFE", "#C6F6D5", "#FEF08A", "#D8B4FE",
        "#F87171", "#34D399", "#60A5FA", "#FCD34D", "#A78BFA",
        "#F472B6", "#22D3EE", "#4ADE80", "#FACC15", "#C084FC",
        "#F59E0B", "#EC4899", "#3B82F6", "#10B981", "#EAB308"
    ];

    const container = document.createElement("div");
    container.className = "blobs-container fixed inset-0 -z-10";
    document.body.appendChild(container);

    let blobsList = [];
    const maxBlobs = 10, minSize = 60, maxSize = 150;

    const createBlob = () => {
        const blob = document.createElement("div");
        blob.className = "blob absolute rounded-full opacity-0 cursor-pointer"; // cursor pointer for feedback
        const size = random(minSize, maxSize);
        blob.style.width = blob.style.height = `${size}px`;
        blob.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        blob.x = random(0, window.innerWidth - size);
        blob.y = random(0, window.innerHeight - size);
        blob.vx = random(-1.5, 1.5);
        blob.vy = random(-1.5, 1.5);
        blob.lifespan = random(8, 20);
        blob.age = 0;

        container.appendChild(blob);
        blobsList.push(blob);

        // Fade in
        requestAnimationFrame(() => {
            blob.style.transition = "opacity 1.5s";
            blob.style.opacity = "0.15";
        });

        // Add click to pop
        blob.addEventListener("click", () => {
            // explodeText();
            blob._popping = true;
            blob._scale = 2;
            blob.style.transition = "transform 0.3s ease, opacity 0.3s ease";
            blob.style.transform = `scale(2)`; // optional pop scale
            blob.style.opacity = 0;

            setTimeout(() => {
                blob.remove();
                blobsList = blobsList.filter(b => b !== blob);
            }, 300);
        });
    };

    const animate = () => {
        blobsList.forEach((b, i) => {
            if (!b._popping) {
                b.x += b.vx;
                b.y += b.vy;

                // Bounce off walls
                if (b.x < 0 || b.x + b.offsetWidth > window.innerWidth) b.vx *= -1;
                if (b.y < 0 || b.y + b.offsetHeight > window.innerHeight) b.vy *= -1;

                // Bounce off other blobs
                for (let j = i + 1; j < blobsList.length; j++) {
                    const o = blobsList[j];
                    const dx = (b.x + b.offsetWidth / 2) - (o.x + o.offsetWidth / 2);
                    const dy = (b.y + b.offsetHeight / 2) - (o.y + o.offsetHeight / 2);
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const minDist = (b.offsetWidth + o.offsetWidth) / 2;

                    if (dist < minDist && dist > 0) {
                        const angle = Math.atan2(dy, dx);
                        const overlap = minDist - dist;

                        b.x += Math.cos(angle) * (overlap / 2);
                        b.y += Math.sin(angle) * (overlap / 2);
                        o.x -= Math.cos(angle) * (overlap / 2);
                        o.y -= Math.sin(angle) * (overlap / 2);

                        [b.vx, o.vx] = [o.vx, b.vx];
                        [b.vy, o.vy] = [o.vy, b.vy];
                    }
                }
            }


            // b.style.transform = `translate(${b.x}px, ${b.y}px)`;
            b.style.transform = `translate(${b.x}px, ${b.y}px) scale(${b._scale || 1})`;
            b.age += 0.016;

            if (b.age > b.lifespan && !b._isFadingOut) {
                b._isFadingOut = true;
                b.style.transition = "opacity 2s";
                b.style.opacity = 0;

                setTimeout(() => {
                    b.remove?.();
                    blobsList = blobsList.filter(blob => blob !== b);
                }, 2000);
            }
        });

        requestAnimationFrame(animate);
    };

    const blobInterval = setInterval(() => {
        if (blobsList.length < maxBlobs) createBlob();
    }, 2000);

    window.addEventListener('pagehide', () => clearInterval(blobInterval));

    animate();
}

// ---------- Flip Card (shared) ----------
function setupFlipCards() {
    document.querySelectorAll(".flip-card").forEach(card => {
        card.addEventListener("click", () => card.classList.toggle("flipped"));

        card.addEventListener("keydown", e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.classList.toggle("flipped");
            }
        });

        const duration = 5 + Math.random() * 4;
        const initialZ = (Math.random() - 0.5) * 4;
        card.style.transform = `rotateZ(${initialZ}deg)`;
        card.style.animationDuration = `${duration}s`;
    });
}

// ---------- Carousel (shared) ----------
function setupCarousel(carouselId, leftBtnId, rightBtnId, scrollAmount) {
    const carousel = document.getElementById(carouselId);
    const leftBtn = document.getElementById(leftBtnId);
    const rightBtn = document.getElementById(rightBtnId);
    if (!carousel || !leftBtn || !rightBtn) return;

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
        const keyScroll = 100;
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            carousel.scrollBy({ left: keyScroll, behavior: 'smooth' });
        } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            carousel.scrollBy({ left: -keyScroll, behavior: 'smooth' });
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
}

// ---------- Progress Bar & Smooth Scroll ----------
function progressBar() {
    const progress = document.getElementById("progress-bar");
    const sectionLinks = document.querySelectorAll(".relative.flex a");

    const sections = Array.from(sectionLinks).map(link =>
        document.getElementById(link.getAttribute("href").slice(1))
    );

    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        progress.style.width = (scrollTop / docHeight) * 100 + "%";
    });

    sectionLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const target = document.getElementById(link.getAttribute("href").slice(1));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 60, behavior: "smooth" });
            }
        });
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    // Critical tasks
    progressBar();

    // Non-critical background tasks
    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };
    ric(() => {
        blobBackground();
        // Service Worker registration (non-critical)
        if ('serviceWorker' in navigator) {
            let swUrl = '/service-worker.js';
            if (window.trustedTypes) {
                const policy = trustedTypes.createPolicy('default', {
                    createScriptURL: (url) => url
                });
                swUrl = policy.createScriptURL(swUrl);
            }
            navigator.serviceWorker.register(swUrl)
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    });

});