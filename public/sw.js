// Service worker minimal — juste assez pour rendre l'app installable (PWA).
// L'offline-first complet est hors périmètre du MVP (voir cahier des charges).

self.addEventListener("install", () => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener("fetch", (event) => {
  // Pass-through : on ne met rien en cache pour l'instant.
  event.respondWith(fetch(event.request))
})