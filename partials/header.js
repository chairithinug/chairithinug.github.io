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

    // 1. Apply initial theme from localStorage or default to dark
    const isDark = localStorage.getItem("dark-mode") === "true";
    document.documentElement.classList.toggle("dark", isDark);

    // 2. Set initial thumb position
    if (thumb) thumb.classList.toggle("translate-x-6", isDark);

    // 3. Add click listener
    toggle.addEventListener("click", () => {
        const dark = document.documentElement.classList.toggle("dark");
        if (thumb) thumb.classList.toggle("translate-x-6");
        localStorage.setItem("dark-mode", dark);
        localStorage.theme = dark ? "dark" : "light";
    });
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

// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch('/partials/header.html')
        .then(res => res.text())
        .then(html => {
            document.getElementById('header-container').innerHTML = html;
            darkMode();
            getWeather();
            // Language buttons
            document.querySelectorAll(".lang-btn").forEach(btn =>
                btn.addEventListener("click", () => loadLanguage(btn.dataset.lang))
            );
        });
});