# Anapat Chairithinugull's Personal Website

Source code for [www.chairithinug.com](https://www.chairithinug.com) — a static personal website showcasing a portfolio, resume, blog, and other professional and personal content. The site is responsive, multilingual, PWA-ready, and optimized for performance and SEO.

## Project Structure

```text
.
├── articles/            # Blog article HTML files
├── icons/               # Icons used throughout the site
├── img/                 # Images used across the site
├── lang/                # Localization files (en, th, da)
├── partials/            # Reusable HTML, CSS, and JavaScript components
├── pdf/                 # PDF files (e.g., resume)
├── .gitignore           # Git ignore rules
├── 404.html             # Custom 404 error page
├── articles.html        # Blog articles index page
├── back-to-top.js       # Back-to-top button functionality
├── books.html           # Books reading list page
├── career.html          # Career timeline and work experience page
├── career-script.js     # JavaScript for career page
├── CNAME                # Custom domain for GitHub Pages
├── custom.css           # Additional custom CSS
├── faq.html             # Frequently Asked Questions page
├── faq-script.js        # JavaScript for FAQ page
├── index.html           # Homepage
├── index-script.js      # JavaScript for homepage
├── input.css            # Source CSS file for PostCSS processing
├── install-prompt.js    # PWA install prompt with iOS fallback
├── interests.html       # Personal and professional interests page
├── interests-script.js  # JavaScript for interests page
├── package.json         # Node.js project metadata and build config
├── postcss.config.js    # PostCSS configuration
├── privacy.html         # Privacy & Accessibility policy page
├── projects.html        # Projects portfolio page
├── robots.txt           # SEO robots.txt
├── script.js            # Global JavaScript utilities
├── service-worker.js    # Service worker for PWA offline support
├── sitemap.xml          # Sitemap for search engines
├── skills.html          # Skills and certifications page
├── skills-script.js     # JavaScript for skills page
├── styles.css           # Compiled global CSS
└── template.html        # Template for new pages
```

## Key Features

- **Responsive Design**: Optimized for desktop and mobile devices.
- **Multilingual Support**: JSON-based localization for English, Thai, and Danish in the `lang/` directory.
- **PWA Support**: Installable as a Progressive Web App with a custom install prompt and iOS fallback.
- **SEO Optimized**: Includes metadata, structured data, sitemap, and `robots.txt`.
- **Offline Support**: Service worker for caching and offline access.
- **Reusable Components**: Modular HTML, CSS, and JavaScript partials for the header, footer, and sidebar.
- **Blog/Articles**: Blog-style content with automatic reading-time estimation.
