/* eslint-disable */

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('vbago').then(function(cache) {
     return cache.addAll([
       '/',
       '/static/reset.css',
       'https://api.mapbox.com/mapbox-gl-js/v0.39.1/mapbox-gl.css',
       'https://fonts.googleapis.com/icon?family=Material+Icons',
       '/static/css/app.c82997b439c5241f19b616391124a21b.css',
       'static/js/vendor.3e5e0a3e16f169ffb872.js',
       '/static/js/app.134edd416df4f6f03a64.js',
       'https://fonts.gstatic.com/s/materialicons/v29/2fcrYFNaTjcS6g4U3t-Y5ZjZjT5FdEJ140U2DJYC3mY.woff2',
       '/static/fonts/hinted-VIC-Regular.25fc693.woff2',
     ]);
   })
 );
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});