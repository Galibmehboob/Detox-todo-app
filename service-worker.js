/* Detox Life service worker. HTML is network-first; static assets are cache-first.
   A new deployment uses a new cache version, and old caches are removed on activation. */
const CACHE_PREFIX = 'detox-life-pwa-shell-';
const CACHE_NAME = CACHE_PREFIX + 'v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          cache.put('./index.html', response.clone()).catch(() => {});
        }
        return response;
      } catch (_) {
        return (await caches.match(request)) ||
          (await caches.match('./index.html')) ||
          new Response('Detox Life is offline and the app shell is not cached yet. Reconnect once and reload.', {
            status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
          });
      }
    })());
    return;
  }

  if (/\.(?:png|webmanifest)$/.test(url.pathname) || url.pathname.endsWith('/')) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) {
        fetch(request).then(async response => {
          if (response && response.ok) (await caches.open(CACHE_NAME)).put(request, response);
        }).catch(() => {});
        return cached;
      }
      try {
        const response = await fetch(request);
        if (response && response.ok) (await caches.open(CACHE_NAME)).put(request, response.clone());
        return response;
      } catch (_) {
        return new Response('', {status: 504});
      }
    })());
  }
});
