"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    if (res.ok) {
      setLoginSuccess(true);
    } else {
      const data = await res.json();
      setError(data.error || "Erro no login");
    }
  };

  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        router.push("/admin");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, router]);

  if (loginSuccess) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-80">
          <h1 className="text-2xl font-bold mb-4">
            Login realizado com sucesso!
          </h1>
          <p className="mb-4">Redirecionando para a área administrativa...</p>
          <p>
            Se você não for redirecionado automaticamente,{" "}
            <button
              onClick={() => router.push("/admin")}
              className="underline text-blue-400 hover:text-blue-600"
            >
              clique aqui
            </button>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-80"
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

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white pr-10"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <EyeOff size={24} /> : <Eye size={24} />}
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg text-lg font-bold"
        >
          Entrar
        </button>
      </form>
      <button
        onClick={() => router.push("/")}
        className="
        fixed top-4 right-4
        flex items-center gap-2
        bg-gray-500 text-white
        px-4 py-2 rounded-lg
        hover:bg-gray-300
        z-50
        shadow-lg
      "
      >
        <ArrowLeft size={20} /> Voltar
      </button>
    </main>
  );
}
