"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShieldCheck, Goal, Zap, Volleyball } from "lucide-react";
import ActionModal from "@/components/ActionModal";
import Image from "next/image";
import styles from "./page.module.css"; // Importando o CSS do módulo

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const sendAction = async (action: string) => {
    setLoading(true);
    try {
      // send action to server
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        // handle error status
        throw new Error("Falha na requisição");
      }
      // sucesso
    } catch (error) {
      // opcional: tratar erro (poderíamos mostrar um modal de erro)
    } finally {
      setLoading(false);
      setModalMessage(`Ação ${action} registrada!`);
      setShowModal(true);
    }
  };

  const handleAction = (action: string) => {
    // prevenimos envios duplicados enquanto já estiver enviando
    if (loading) return;

    // Reproduz som (não bloqueante)
    const whistle = new Audio("/campainha.mp3");
    void whistle.play().catch(() => {
      /* ignorar erro de autoplay */
    });

    sendAction(action);
  };

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => console.log("SW registrado"))
        .catch((err) => console.log("Erro ao registrar SW: " + err.message));
    }
  }, []);

  return (
    <main className={styles.main}>
      {/* Overlay comentado para evitar bloqueio */}
      {/* <div className={styles.overlay}></div> */}
      <div className={styles.content}>
        <div className={styles.logoContainer}>
          <Image
            src="/logo-sitio-khalifa.png"
            alt="Logo do Projeto"
            width={200}
            height={200}
            style={{ height: "auto", maxWidth: "200px" }}
            priority
          />
        </div>

        <h1 className={styles.title}>Gol ⚽ Lances</h1>

        <div className={styles.buttonContainer}>
          <button
            onClick={() => handleAction("Gol")}
            disabled={loading}
            className={`${styles.button} ${styles.golButton}`}
          >
            <Goal size={48} /> <span>Gol</span>
          </button>
          <button
            onClick={() => handleAction("Drible")}
            disabled={loading}
            className={`${styles.button} ${styles.dribleButton}`}
          >
            <Zap size={48} /> <span>Drible</span>
          </button>
          <button
            onClick={() => handleAction("Lencol")}
            disabled={loading}
            className={`${styles.button} ${styles.lencolButton}`}
          >
            <Volleyball size={48} /> <span>Lençol</span>
          </button>
        </div>

        {loading && <p className={styles.loading}>Enviando...</p>}
      </div>

      <button
        onClick={() => {
          try {
            router.push("/admin");
          } catch {
            window.location.href = "/admin";
          }
        }}
        className={styles.adminButton}
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
