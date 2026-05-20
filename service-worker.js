const CACHE_NAME = 'pwa-cache-v30';
const OFFLINE_URL = '/404.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/articles.html',
  '/projects.html',
  '/interests.html',
  '/skills.html',
  '/career.html',
  '/faq.html',
  '/books.html',
  '/privacy.html',
  '/404.html',
  '/articles/reflections-on-ai-and-coding.html',
  '/articles/cycling-in-denmark-how-to-ride-like-a-dane.html',
  '/style.css',
  '/site.js',
  '/chrome.js',
  '/manifest.webmanifest',
  '/robots.txt',
  '/sitemap.xml',
  '/lang/en.json',
  '/lang/th.json',
  '/lang/da.json',
  '/img/anapat_chairithinugull.jpeg',
  '/img/anapat_chairithinugull-224.webp',
  '/img/anapat_chairithinugull-320.webp',
  '/img/anapat_chairithinugull-448.webp',
  '/icons/favicon/favicon.ico',
  '/icons/favicon/favicon.svg',
  '/icons/favicon/favicon-16x16.png',
  '/icons/favicon/favicon-32x32.png',
  '/icons/favicon/favicon-96x96.png',
  '/icons/favicon/apple-touch-icon.png',
  '/icons/favicon/site.webmanifest',
  '/icons/favicon/web-app-manifest-192x192.png',
  '/icons/favicon/web-app-manifest-512x512.png'
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