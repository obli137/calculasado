self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Passthrough: cumple el requisito de SW para instalación sin cache agresivo.
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request))
})
