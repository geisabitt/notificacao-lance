"use client";

import { useState } from "react";

export default function EnableNotifications() {
  const [status, setStatus] = useState("");

  const activateNotifications = async () => {
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      alert("Seu navegador não suporta notificações");
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      setStatus("Permissão negada para notificações");
      return;
    }

    const sw = await navigator.serviceWorker.ready;
    const subscription = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY, // ✅ chave pública VAPID
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    setStatus("Notificações ativadas!");
  };

  return (
    <div className="mt-4 text-center">
      <button
        onClick={activateNotifications}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
      >
        Ativar Notificações
      </button>
      {status && <p className="text-gray-200 mt-2">{status}</p>}
    </div>
  );
}
