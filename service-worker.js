const CACHE_NAME = 'bsvrb-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/interface/ethicom-style.css',
  '/interface/bundle.js',
  '/utils/op-level.js',
  '/sources/images/op-logo/tanna_op0.png',
  '/sources/images/op-logo/tanna_op1.png',
  '/sources/images/op-logo/tanna_op2.png',
  '/sources/images/op-logo/tanna_op3.png',
  '/sources/images/op-logo/tanna_op4.png',
  '/sources/images/op-logo/tanna_op5.png',
  '/sources/images/op-logo/tanna_op6.png',
  '/sources/images/op-logo/tanna_op7.png'
];
self.addEventListener('install', evt => {
  evt.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});
self.addEventListener('fetch', evt => {
  evt.respondWith(caches.match(evt.request).then(res => res || fetch(evt.request)));
});
