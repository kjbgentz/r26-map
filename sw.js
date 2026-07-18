const CACHE = 'r26-map-v8';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './pdf/bike_maps.pdf', './pdf/stay_02.pdf', './pdf/stay_03.pdf', './pdf/stay_04.pdf', './pdf/stay_05.pdf', './pdf/stay_06.pdf', './pdf/stay_07.pdf', './pdf/town_02.pdf', './pdf/town_03.pdf', './pdf/town_04.pdf', './pdf/town_05.pdf', './pdf/town_06.pdf', './pdf/town_07.pdf', './pdf/vehicle_routes.pdf', './pdf/vendors_02.pdf', './pdf/vendors_03.pdf', './pdf/vendors_04.pdf', './pdf/vendors_05.pdf', './pdf/vendors_06.pdf', './pdf/vendors_07.pdf'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request, {ignoreSearch: true}).then(hit =>
      hit || fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match('./index.html'))
    )
  );
});
