"use client";
import { useEffect, useState } from "react";

type EventItem = {
  action: string;
  timestamp: string;
};

export default function AdminPage() {
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    fetch("/api/events")
      .then((res) => res.json())
      .then(setEvents);

    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js").then((registration) => {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            navigator.serviceWorker.register("/sw.js").then((registration) => {
              console.log("SW registrado:", registration);
            });
            registration.pushManager
              .subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(
                  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
                ),
              })
              .then((sub) => {
                fetch("/api/push/subscribe", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(sub),
                });
              });
          }
        });
      });
    }
  }, []);

  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin - Eventos</h1>
      <ul>
        {events.map((e, i) => (
          <li key={i}>
            {e.action} - {new Date(e.timestamp).toLocaleString()}
          </li>
        ))}
      </ul>
    </main>
  );
}
