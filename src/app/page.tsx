"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShieldCheck, Goal, Zap, Volleyball } from "lucide-react";
import ActionModal from "@/components/ActionModal";
import Image from "next/image";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const sendAction = async (action: string) => {
    setLoading(true);
    await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    setLoading(false);
    setModalMessage(`Ação ${action} registrada!`);
    setShowModal(true);
  };

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center text-white px-4"
      style={{
        background: "url(/stadium-bg.png) center/cover no-repeat",
      }}
    >
      <div className="absolute inset-0"></div>

      <div className="relative z-10 text-center w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image
            src="/logo-sitio-khalifa.png"
            alt="Logo do Projeto"
            width={200}
            height={0}
            style={{ height: "auto", maxWidth: "200px" }}
            priority
          />
        </div>

        <h1 className="text-4xl font-extrabold mb-8 tracking-wide">
          Gol ⚽ Lances
        </h1>

        <div className="flex flex-col gap-6 justify-center">
          <button
            onClick={() => sendAction("Gol")}
            className="flex items-center justify-center gap-4 bg-green-500 hover:bg-green-600 text-white rounded-full px-8 py-6 shadow-xl transition transform hover:scale-105 text-3xl font-bold"
          >
            <Goal size={48} /> Gol
          </button>
          <button
            onClick={() => sendAction("Drible")}
            className="flex items-center justify-center gap-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-8 py-6 shadow-xl transition transform hover:scale-105 text-3xl font-bold"
          >
            <Zap size={48} /> Drible
          </button>
          <button
            onClick={() => sendAction("Lencol")}
            className="flex items-center justify-center gap-4 bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-6 shadow-xl transition transform hover:scale-105 text-3xl font-bold"
          >
            <Volleyball size={48} /> Lençol
          </button>
        </div>

        {loading && <p className="mt-4 text-lg">Enviando...</p>}
      </div>

      {/* Botão administrativo */}
      <button
        onClick={() => router.push("/admin")}
        className="fixed bottom-6 left-6 bg-gray-900 p-4 rounded-full shadow-lg hover:bg-gray-700 transition transform hover:scale-110 z-20"
        title="Área Administrativa"
      >
        <ShieldCheck size={28} />
      </button>
      {showModal && (
        <ActionModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
    </main>
  );
}
