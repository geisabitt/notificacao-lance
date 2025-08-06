self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title || "Notificação", {
      body: data.body || "",
      icon: "/icon-lances-gol-192x192.png",
      badge: "/icon-lances-gol-192x192.png",
      data: {
        url: data.url || "/admin", // ✅ Caso queira abrir uma página
      },
    })
  );
});

// ✅ Clique na notificação abre a URL
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data.url || "/";
  event.waitUntil(clients.openWindow(url));
});

// ✅ Ativar SW imediatamente
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
