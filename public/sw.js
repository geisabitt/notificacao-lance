self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icon-192x192.png", // ícone da notificação
      badge: "/icon-192x192.png", // ícone menor (badge)
      vibrate: [100, 50, 100], // vibração opcional para dispositivos móveis
      data: {
        url: "/admin", // URL para onde redirecionar no clique
      },
    })
  );
});

// Quando o usuário clicar na notificação
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/admin";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Tenta focar uma aba que já tenha a URL /admin aberta
        for (const client of clientList) {
          if (client.url.includes(targetUrl) && "focus" in client) {
            return client.focus();
          }
        }
        // Se não achar, abre uma nova aba com a URL /admin
        if (clients.openWindow) {
          return clients.openWindow(targetUrl);
        }
      })
  );
});
