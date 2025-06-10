const CACHE_NAME = 'aari-v1';
const ASSETS = [
  '/',
  '/aari/index.html',
  '/aari/assets/styles.css',
  '/aari/manifest.json',
  '/aari/modules/aari-core.js'
];
self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS))
  );
});
self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
