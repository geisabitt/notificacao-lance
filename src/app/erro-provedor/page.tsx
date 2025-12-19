import React from "react";

export const metadata = {
  title: "Erro de Serviço",
  description: "Acesso temporariamente bloqueado. Entre em contato com o provedor de serviço.",
};

export default function ErroProvedorPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-bold mb-4">Erro de Serviço</h1>
        <p className="text-lg mb-6">
          O acesso ao site está bloqueado. <strong>Entre em contato com o provedor de
          serviço</strong> para mais informações.
        </p>
        <p className="text-sm text-gray-500">
          {/* Caso precise, contate: <a href="mailto:suporte@example.com" className="text-blue-600 underline">suporte@example.com</a> */}
        </p>
      </div>
    </main>
  );
}
