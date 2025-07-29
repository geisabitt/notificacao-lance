"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react"; // Ícone de restrito

export default function Home() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
    <main className="p-6 text-center relative min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Escolha uma ação</h1>
      <div className="flex gap-4 justify-center mb-6">
        <button
          onClick={() => sendAction("Gol")}
          className="bg-green-500 text-white px-4 py-2 rounded shadow-lg"
        >
          Gol
        </button>
        <button
          onClick={() => sendAction("Drible")}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-lg"
        >
          Drible
        </button>
        <button
          onClick={() => sendAction("Falta")}
          className="bg-red-500 text-white px-4 py-2 rounded shadow-lg"
        >
          Falta
        </button>
      </div>

      {loading && <p className="mt-4 text-gray-600">Enviando...</p>}

      {/* Ícone administrativo flutuante */}
      <button
        onClick={() => router.push("/admin")}
        className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-full shadow-lg hover:bg-gray-700"
        title="Área Administrativa"
      >
        <ShieldCheck size={28} />
      </button>
    </main>
  );
}
