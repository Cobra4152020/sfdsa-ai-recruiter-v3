// Service Worker for Push Notifications
self.addEventListener("push", (event) => {
  try {
    // Try to parse the data as JSON
    let data
    try {
      data = event.data.json()
    } catch (e) {
      // If parsing fails, use the text as the message
      data = {
        title: "New Notification",
        message: event.data ? event.data.text() : "You have a new notification",
      }
    }

    const options = {
      body: data.message || "You have a new notification",
      icon: data.icon || "/notification-icon.png",
      badge: "/sfdsa-logo.png",
      data: {
        url: data.actionUrl || "/",
      },
      vibrate: [100, 50, 100],
      tag: data.tag || "default",
    }

    event.waitUntil(self.registration.showNotification(data.title || "New Notification", options))
  } catch (error) {
    console.error("Error handling push event:", error)
    // Show a generic notification as fallback
    event.waitUntil(
      self.registration.showNotification("New Notification", {
        body: "You have a new notification",
        icon: "/notification-icon.png",
      }),
    )
  }
})

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        const url = event.notification.data && event.notification.data.url ? event.notification.data.url : "/"

        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus()
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      }),
  )
})

// Ensure the service worker is properly activated
self.addEventListener("install", (event) => {
  self.skipWaiting()
})

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim())
})
