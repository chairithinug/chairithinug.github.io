const CACHE_NAME = 'pwa-cache-v7';
const OFFLINE_URL = '/404.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/articles.html',
  '/projects.html',
  '/interests.html',
  '/interests-script.js',
  '/skills.html',
  '/skills-script.js',
  '/career.html',
  '/career-script.js',
  '/articles/reflections-on-ai-and-coding.html',
  '/articles/post-footer.html',
  '/articles/post-footer.js',
  '/faq.html',
  '/faq-script.js',
  '/404.html',
  '/styles.css',
  '/script.js',
  '/partials/header.html',
  '/partials/footer.html',
  '/partials/sidebar.html',
  '/partials/footer.js',
  '/partials/header.js',
  '/partials/sidebar.js',
  '/manifest.json',
  '/robots.txt',
  '/sitemap.xml',
  '/img/anapat_chairithinugull.jpeg',
  '/icons/icon16.png',
  '/icons/icon32.png',
  '/icons/icon48.png',
  '/icons/icon60.png',
  '/icons/icon152.png',
  '/icons/icon167.png',
  '/icons/icon180.png',
  '/icons/icon192.png',
  '/icons/icon512.png'
];

// Helper: fetch and cache a request (same-origin only)
async function fetchAndCache(request) {
  try {
    const response = await fetch(request);
    // only cache successful same-origin GET responses
    if (response && response.ok && new URL(request.url).origin === location.origin) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    console.error('Fetch and cache error:', err);
    return undefined;
  }
}

// Install event — resilient caching
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Fetch all resources and individually put successful responses into cache
    const results = await Promise.allSettled(
      urlsToCache.map(u => fetch(new Request(u, { cache: 'no-cache' })))
    );
    await Promise.all(results.map(async (r, i) => {
      if (r.status === 'fulfilled' && r.value && r.value.ok) {
        try {
          await cache.put(urlsToCache[i], r.value.clone());
        } catch (e) {
          console.error(`Failed to cache ${urlsToCache[i]}:`, e);
        }
      }
    }));
    // Ensure fallback page cached if possible
    try {
      const offlineResp = await fetch(new Request(OFFLINE_URL, { cache: 'no-cache' }));
      if (offlineResp && offlineResp.ok) await cache.put(OFFLINE_URL, offlineResp.clone());
    } catch (err) {
      console.error('Failed to cache offline page:', err);
    }
  })());
  self.skipWaiting();
});

// Fetch event
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const reqUrl = new URL(event.request.url);

  // For navigations (HTML pages) prefer network-first with offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // Try network first
        const networkResponse = await fetchAndCache(event.request);
        if (networkResponse) return networkResponse;

        // If network fails, try cache
        const cacheResponse = await caches.match(event.request);
        if (cacheResponse) return cacheResponse;

        // If both fail, return offline page
        return await caches.match(OFFLINE_URL);
      } catch (err) {
        // Last resort - offline page
        console.error('Navigation fetch failed:', err);
        return await caches.match(OFFLINE_URL);
      }
    })());
    return;
  }

  // For non-navigation requests, use cache-first strategy
  event.respondWith((async () => {
    try {
      // Try cache first
      const cacheResponse = await caches.match(event.request);
      if (cacheResponse) return cacheResponse;

      // If not in cache, try network
      const networkResponse = await fetchAndCache(event.request);
      if (networkResponse) return networkResponse;

      // If both fail, return error
      throw new Error('Resource not available');
    } catch (err) {
      console.error('Resource fetch failed:', err);
      throw err;
    }
  })());
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter(name => name !== CACHE_NAME)
        .map(name => caches.delete(name))
    );
    await clients.claim();
  })());
});