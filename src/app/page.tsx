"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const sendAction = async (action: string) => {
    setLoading(true);
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(false);
    alert(`Ação ${action} registrada!`);
  };

  return (
    <main className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Escolha uma ação</h1>
      <div className="flex gap-4 justify-center">
        <button
          onClick={() => sendAction("Gol")}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Gol
        </button>
        <button
          onClick={() => sendAction("Drible")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Drible
        </button>
        <button
          onClick={() => sendAction("Falta")}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Falta
        </button>
      </div>
      {loading && <p className="mt-4 text-gray-600">Enviando...</p>}
    </main>
  );
}
