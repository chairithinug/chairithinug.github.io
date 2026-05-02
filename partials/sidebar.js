// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch('/partials/sidebar.html')
        .then(res => {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.text();
        })
        .then(html => {
            document.getElementById('sidebar-container').innerHTML = html;
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

            // Now the header exists, we can highlight the nav link
            const currentPath = window.location.pathname.split("/").pop(); // e.g. "about.html"
            const navLinks = document.querySelectorAll("nav a");

            navLinks.forEach(link => {
                const linkPath = link.getAttribute("href").split("/").pop();
                if (linkPath === currentPath) {
                    link.classList.add("font-semibold", "text-blue-600", "dark:text-blue-400");
                } else {
                    link.classList.remove("font-semibold", "text-blue-600", "dark:text-blue-400");
                }
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
                        if (window.innerWidth < 768) sidebar.classList.add('-translate-x-full');
                    });
                });

                document.addEventListener('keydown', e => {
                    if (e.key === 'Escape') sidebar.classList.add('-translate-x-full');
                });
            }
        })
        .catch(err => {
            console.error('Failed to load sidebar partial:', err);
            if (typeof window.showPartialError === 'function') {
                window.showPartialError('sidebar-container', 'sidebar navigation');
            }
        });

});