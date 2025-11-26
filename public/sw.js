// Service Worker for offline caching and performance
// Save this as public/sw.js

const CACHE_NAME = 'svec-cms-v1';
const urlsToCache = [
  '/',
  '/departments/CSEAI',
  '/departments/CST',
  '/public/logo.png',
];

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Cache opened');
      return cache.addAll(urlsToCache).catch((err) => {
        console.log('Service Worker: Some URLs failed to cache', err);
      });
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return from cache if available
      if (response) {
        return response;
      }

      return fetch(event.request)
        .then((response) => {
          // Don't cache if not ok
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache API responses separately
          if (event.request.url.includes('/api/')) {
            const apiCacheName = `${CACHE_NAME}-api`;
            caches.open(apiCacheName).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          } else {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }

          return response;
        })
        .catch(() => {
          // Fallback to cache if network is down
          return caches.match(event.request);
        });
    })
  );
});
