"use client";
import { useEffect, useState } from "react";

export default function EnableNotifications() {
  const [permission, setPermission] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const enableNotifications = async () => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      const reg = await navigator.serviceWorker.ready;

      const subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY, // ✅ sua chave pública
      });

      // Salvar no backend
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      setPermission("granted");
    }
  };

  if (permission === "granted") return null;

  return (
    <button
      onClick={enableNotifications}
      className="bg-green-500 px-4 py-2 rounded text-white"
    >
      Ativar Notificações
    </button>
  );
}
