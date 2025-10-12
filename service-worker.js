const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icons/icon152.png',
  '/icons/icon167.png',
  '/icons/icon180.png',
  '/icons/icon192.png',
  '/icons/icon512.png',
  '/icons/icon16.png',
  '/icons/icon32.png',
  '/icons/icon48.png',
  '/icons/icon60.png',
  'manifest.json',
  'robots.txt',
  'sitemap.xml',
];

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Fetch event
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request);

      const networkFetch = fetch(event.request)
        .then(async networkResponse => {
          // Clone response for cache
          const responseClone = networkResponse.clone();

          const cache = await caches.open(CACHE_NAME);
          await cache.put(event.request, responseClone);

          return networkResponse; // original goes to browser
        })
        .catch(() => {
          // Optional offline fallback
          // if (event.request.mode === "navigate") {
          //   return caches.match(OFFLINE_URL);
          // }
        });

      return cachedResponse || networkFetch;
    })()
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});