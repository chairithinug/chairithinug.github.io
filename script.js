// ---------- Utility ----------
const random = (min, max) => Math.random() * (max - min) + min;

// ---------- Blob Background ----------
function blobBackground() {
    const colors = [
        "#FBB6CE", "#BFDBFE", "#C6F6D5", "#FEF08A", "#D8B4FE",
        "#F87171", "#34D399", "#60A5FA", "#FCD34D", "#A78BFA",
        "#F472B6", "#22D3EE", "#4ADE80", "#FACC15", "#C084FC",
        "#F59E0B", "#EC4899", "#3B82F6", "#10B981", "#EAB308"
    ];

    const container = document.createElement("div");
    container.className = "blobs-container fixed inset-0 z-0";
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

    setInterval(() => {
        if (blobsList.length < maxBlobs) createBlob();
    }, 2000);

    animate();
}

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

// ---------- Weather ----------
async function getWeather() {
    try {
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=55.6758&longitude=12.5683&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code");
        const data = await res.json();
        const current = data.current;

        document.getElementById("weather-temp").textContent = `Copenhagen: ${current.temperature_2m}°C`;
        document.getElementById("weather-desc").textContent = `Humidity: ${current.relative_humidity_2m}%, Wind: ${current.wind_speed_10m} m/s`;
    } catch (e) {
        console.error("Weather fetch failed:", e);
    }
}

// ---------- Dark Mode Toggle ----------
function darkMode() {
    const toggle = document.getElementById("dark-toggle");
    const thumb = document.getElementById("dark-toggle-thumb");

    if (localStorage.getItem("dark-mode") === "true") {
        document.documentElement.classList.add("dark");
        thumb.classList.add("translate-x-6");
    }

    toggle.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");
        thumb.classList.toggle("translate-x-6");
        localStorage.setItem("dark-mode", document.documentElement.classList.contains("dark"));
    });
}

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

// ---------- Language ----------
function loadLanguage(lang) {
    fetch(`lang/${lang}.json`)
        .then(res => res.json())
        .then(data => {
            const elements = [
                "name-title", "profile-title", "profile-summary", "skills-title",
                "timeline-title", "work-title", "education-title", "further-title",
                "volunteer-title", "languages-title", "interests-title", "sports-title", "weather-title"
            ];

            elements.forEach(id => {
                if (data[id]) document.getElementById(id).textContent = data[id];
            });
        })
        .finally(() => console.log(`Language changed to: ${lang}`));
}

// ---------- Cookies & Analytics ----------
function setupCookies() {
    const overlay = document.getElementById("cookie-overlay");
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");
    const rejectBtn = document.getElementById("reject-cookies");

    const hideBanner = () => {
        overlay.style.display = "none";
        banner.style.display = "none";
    };

    const cookieConsent = localStorage.getItem("cookieConsent");
    if (cookieConsent === "accepted" || cookieConsent === "rejected") hideBanner();

    acceptBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "accepted");
        hideBanner();
        loadAnalytics();
    });

    rejectBtn.addEventListener("click", () => {
        localStorage.setItem("cookieConsent", "rejected");
        hideBanner();
    });
}

// ---------- Google Analytics Loader ----------
function loadAnalytics() {
    if (localStorage.getItem("analytics-consent") === "true") return;

    localStorage.setItem("analytics-consent", "true");
    const script = document.createElement("script");
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-FJQNSE4GQC";
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', 'G-FJQNSE4GQC', { 'anonymize_ip': true });
    trackLinks();
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

// Only call this after user accepts cookies
function trackLinks() {
    const links = [
        { selector: 'a[href*="linkedin.com"]', label: "LinkedIn" },
        { selector: 'a[href*="strava.com"]', label: "Strava" },
        { selector: 'a[href*="Anapat_Chairithinugull_Resume_polished.pdf"]', label: "Resume" },
        { selector: 'a[href*="ATS_friendly_Anapat_Chairithinugull.pdf"]', label: "ATS Friendly Resume" }
    ];

    links.forEach(link => {
        const element = document.querySelector(link.selector);
        if (!element) return;

        element.addEventListener("click", () => {
            gtag('event', 'click', {
                event_category: 'Link',
                event_label: link.label
            });
        });
    });
}

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {

    const ric = window.requestIdleCallback || function (cb) { return setTimeout(cb, 1); };

    // Non-critical background tasks
    ric(() => {
        blobBackground();
        setupFlipCards();
        setupTimelineEntries();
    });

    // Critical tasks
    progressBar();
    timelinePresent();
    darkMode();
    getWeather();
    setupCookies();
    updateCountdowns();
    setInterval(updateCountdowns, 1000);
    setupCarousel('carousel', 'left-arrow', 'right-arrow', 260);
    setupCarousel('sports-carousel', 'left-sports', 'right-sports', 220);

    // Language buttons
    document.querySelectorAll(".lang-btn").forEach(btn =>
        btn.addEventListener("click", () => loadLanguage(btn.dataset.lang))
    );

    // Scroll with offset
    document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const headerOffset = document.querySelector('#main-header').offsetHeight;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Sidebar toggle (hamburger)
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');

    if (sidebar && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('-translate-x-full');
        });

        sidebar.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', () => {
                if(window.innerWidth < 768) sidebar.classList.add('-translate-x-full');
            });
        });
    }

    // Service Worker registration (non-critical)
    ric(() => {
        if ('serviceWorker' in navigator) {
            let swUrl = '/service-worker.js';
            if (window.trustedTypes) {
                const policy = trustedTypes.createPolicy('default', {
                    createScriptURL: (url) => url
                });
                swUrl = policy.createScriptURL(swUrl);
            }
            navigator.serviceWorker.register(swUrl)
                .then(reg => console.log('Service Worker registered with scope:', reg.scope))
                .catch(err => console.error('Service Worker registration failed:', err));
        }
    });

});

function explodeText() {
    const elements = document.querySelectorAll("h1, h2, h3, p, span, li");

    elements.forEach(el => {
        if (el._exploded) return; // avoid double explosions
        el._exploded = true;

        const text = el.textContent;
        el.textContent = "";

        [...text].forEach(char => {
            const span = document.createElement("span");
            span.textContent = char;
            span.style.display = "inline-block";
            span.style.transition = "transform 1s ease, opacity 1s ease";
            span.style.transform = "translate(0, 0) rotate(0deg)";
            el.appendChild(span);

            // random trajectory
            const angle = Math.random() * Math.PI * 2;
            const distance = 50 + Math.random() * 200;
            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;
            const rot = Math.random() * 720 - 360;

            // 🔑 Force reflow before animation
            void span.offsetWidth;

            // trigger explosion on next frame
            requestAnimationFrame(() => {
                span.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg)`;
                span.style.opacity = 0;
            });
        });
    });
}