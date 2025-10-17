// ---------- Initialize Everything ----------
document.addEventListener("DOMContentLoaded", () => {
    fetch('/partials/sidebar.html')
        .then(res => res.text())
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
            }
        });
   
});