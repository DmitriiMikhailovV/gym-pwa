/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'

declare const self: ServiceWorkerGlobalScope

// 1. Standard PWA Caching
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
clientsClaim()
self.skipWaiting()

// 2. Handle Push Notifications (FROM SERVER/QSTASH)
self.addEventListener('push', (event) => {
  console.log('[SW] 📩 Push Received via QStash!')

  // Check if app is open and focused
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // If any window is focused, we assume the local app logic handled the notification
      const isFocused = clientList.some((client) => client.focused)

      if (isFocused) {
        console.log('[SW] App is focused, suppressing push notification')
        return
      }

      // Prepare notification data
      let data = { title: 'Timer Finished', body: 'Time to rest!', icon: '/pwa-192x192.png' }

      if (event.data) {
        try {
          data = event.data.json()
        } catch (e) {
          console.log('[SW] Push data is text')
          data.body = event.data.text()
        }
      }

      const options = {
        body: data.body,
        icon: data.icon || '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        vibrate: [200, 100, 200, 100, 200],
        tag: 'rest-timer-finished', // SAME TAG as local notification to support renotify/deduplication
        renotify: true,
        requireInteraction: true,
        data: {
          dateOfArrival: Date.now(),
        },
      }

      return self.registration.showNotification(data.title, options)
    })
  )
})

// 3. Handle Notification Click
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification clicked')
  event.notification.close()

  // Open/Focus App
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus()
        }
      }
      // If not open, open it
      if (self.clients.openWindow) {
        return self.clients.openWindow('/')
      }
    })
  )
})
