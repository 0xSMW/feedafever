self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('fever-cache').then(cache => cache.addAll([
      '/',
      '/mobile',
    ]))
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  )
})
