const CACHE_NAME = 'athena-cache-v7.6.5-' + Date.now(); 
// Build timestamp: 2026-02-01T15:00:00Z

// We cache ONLY the essential icons and manifest.
// The main logic and data should come from the network first.
const urlsToCache = [
  './athena-icon.svg',
  './manifest.json'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  // Verwijder ALLE oude caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  // Network-First voor ALLES tijdens de overgangsfase om cache-poisoning te voorkomen
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
