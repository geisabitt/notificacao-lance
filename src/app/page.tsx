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
      alert(`Enviando ação: ${action}`); // Substitui console.log
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) {
        alert(`Erro no fetch: ${response.status}`); // Substitui console.error
        throw new Error("Falha na requisição");
      }
      alert("Ação enviada com sucesso"); // Substitui console.log
    } catch (error) {
      alert(
        `Erro geral no sendAction: ${
          error instanceof Error ? error.message : String(error)
        }`
      ); // Substitui console.error
    } finally {
      setLoading(false);
      setModalMessage(`Ação ${action} registrada!`);
      setShowModal(true);
    }
  };

  const handleAction = (action: string) => {
    alert(`Ação: ${action}`);
    sendAction(action);
  };

  // Comentei o Service Worker para isolar problemas
  // useEffect(() => {
  //   if ("serviceWorker" in navigator) {
  //     navigator.serviceWorker
  //       .register("/sw.js")
  //       .then(() => alert("SW registrado"))
  //       .catch((err) => alert("Erro ao registrar SW: " + err.message));
  //   }
  // }, []);

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
            onTouchEnd={() => handleAction("Gol")}
            onClick={() => handleAction("Gol")}
            className={`${styles.button} ${styles.golButton}`}
          >
            <Goal size={48} /> <span>Gol</span>
          </button>
          <button
            onClick={() => {
              alert("Botão Drible clicado");
              sendAction("Drible");
            }}
            onTouchStart={() => alert("Toque no botão Drible detectado")} // Novo
            className={`${styles.button} ${styles.dribleButton}`}
          >
            <Zap size={48} /> <span>Drible</span>
          </button>
          <button
            onClick={() => {
              alert("Botão Lençol clicado");
              sendAction("Lencol");
            }}
            onTouchStart={() => alert("Toque no botão Lençol detectado")} // Novo
            className={`${styles.button} ${styles.lencolButton}`}
          >
            <Volleyball size={48} /> <span>Lençol</span>
          </button>
        </div>

        {loading && <p className={styles.loading}>Enviando...</p>}
      </div>

      <button
        onClick={() => {
          alert("Botão Admin clicado");
          try {
            router.push("/admin");
          } catch (error) {
            alert(
              "Erro no router.push: " +
                (error instanceof Error ? error.message : String(error))
            );
            window.location.href = "/admin";
          }
        }}
        onTouchStart={() => alert("Toque no botão Admin detectado")} // Novo
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
