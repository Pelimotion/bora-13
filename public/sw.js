// ═══════════════════════════════════════════════════════════════
// BORA APP — Service Worker (Offline Support)
// ═══════════════════════════════════════════════════════════════

const CACHE_NAME = 'bora-cache-v1';
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // If request is from same origin or Google Fonts, cache it
  if (url.origin === location.origin || url.origin.includes('fonts.gstatic.com') || url.origin.includes('fonts.googleapis.com')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // If network fails, return cached response if available
          return cachedResponse || new Response('Offline - Bora App disponível em cache.', {
            headers: { 'Content-Type': 'text/plain; charset=utf-8' }
          });
        });

        return cachedResponse || fetchPromise;
      })
    );
  }
});
