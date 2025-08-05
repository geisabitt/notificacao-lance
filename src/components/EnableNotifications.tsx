"use client";

import { useEffect, useState } from "react";

export default function EnableNotifications() {
  const [enabled, setEnabled] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    // Verifica se já existe uma inscrição ativa
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.ready.then(async (sw) => {
        const subscription = await sw.pushManager.getSubscription();
        if (subscription) {
          setEnabled(true);
        }
      });
    }
  }, []);

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
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string
      ),
    });

    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(subscription),
    });

    setEnabled(true);
    setStatus("Notificações ativadas!");
  };

  // Função para converter chave VAPID para Uint8Array
  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  if (enabled) return null; // 🔥 Se já está ativo, não mostra nada

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
