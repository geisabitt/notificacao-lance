"use client";
import { useEffect, useState } from "react";

type ActionModalProps = {
  message: string;
  onClose: () => void;
};

export default function ActionModal({ message, onClose }: ActionModalProps) {
  const [progress, setProgress] = useState(100);
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => Math.max(prev - 20, 0));
      setSeconds((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      onClose();
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 text-white rounded-lg shadow-xl w-[90%] max-w-md p-6 relative">
        <h2 className="text-xl font-bold mb-2">Ação registrada!</h2>
        <p className="mb-4">{message}</p>

        {/* Barra de progresso */}
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div
            className="bg-green-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">
            Fechando em {seconds}s...
          </span>
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
