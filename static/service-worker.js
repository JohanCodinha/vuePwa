self.addEventListener('fetch', (event) => {
  console.log('custom fetch', event);
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match('index.html', { ignoreSeaarch: true }))
    )
  }
});
