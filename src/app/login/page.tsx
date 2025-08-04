"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include", // ✅ ESSENCIAL PARA SALVAR COOKIE
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.error || "Erro no login");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-96"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-gray-700 text-white"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg text-lg font-bold"
        >
          Entrar
        </button>
      </form>
    </main>
  );
}
