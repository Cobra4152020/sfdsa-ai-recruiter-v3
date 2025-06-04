// Service Worker for Push Notifications

// Instead of relying on the push event, we'll use a polling mechanism
// to check for new notifications in the queue

// Set up a periodic sync if supported
self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-notifications") {
    event.waitUntil(checkNotifications());
  }
});

// Also check for notifications when the service worker activates
self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
  // Check for notifications on activation
  event.waitUntil(checkNotifications());
});

// Handle message events from the client
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CHECK_NOTIFICATIONS") {
    event.waitUntil(checkNotifications());
  }
});

// Function to check for new notifications
async function checkNotifications() {
  try {
    // We'll implement a client-side polling mechanism instead
    // This will be handled by the client code
    console.log("Service worker checking for notifications");
  } catch (error) {
    console.error("Error checking for notifications:", error);
  }
}

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // This looks to see if the current is already open and focuses if it is
  event.waitUntil(
    clients
      .matchAll({
        type: "window",
      })
      .then((clientList) => {
        const url =
          event.notification.data && event.notification.data.url
            ? event.notification.data.url
            : "/";

        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});

// Ensure the service worker is properly installed
self.addEventListener("install", (event) => {
  self.skipWaiting();
});
