/* Service Worker der Physikwerkstatt: legt die Seite im Browser ab, damit sie offline läuft.
   Er ruft keine fremden Server auf und speichert nur die Dateien dieser Seite. */
const VERSION = 'physikwerkstatt-1.1.0';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icons/icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(VERSION).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  /* Die Klassenmessung (Ordner live/) braucht den lokalen Server und bleibt unberührt. */
  if (url.pathname.includes('/live/')) return;
  event.respondWith(
    caches.open(VERSION).then(async cache => {
      const cached = await cache.match(request, { ignoreSearch: true });
      const refresh = fetch(request).then(response => {
        if (response && response.ok) cache.put(request, response.clone());
        return response;
      }).catch(() => cached);
      return cached || refresh;
    })
  );
});
