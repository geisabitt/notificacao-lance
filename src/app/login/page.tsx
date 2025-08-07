"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });

    setLoading(false);

    if (res.ok) {
      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } else {
      const data = await res.json();
      setError(data.error || "Erro no login");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-900 text-white px-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
        {error && <p className="text-red-500 mb-3">{error}</p>}
        {loginSuccess && (
          <p className="mb-3 text-center">
            ✅ Você já pode acessar a área administrativa. <br />
            <a
              href="/admin"
              className="underline text-green-300 hover:text-green-100"
            >
              Clique aqui se não for redirecionado.
            </a>
          </p>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 rounded bg-gray-700 text-white focus:outline-none"
          required
        />
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white pr-10 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-400 hover:text-white"
          >
            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
          </button>
        </div>
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded-lg text-lg font-bold flex items-center justify-center gap-2"
          disabled={loading}
        >
          {loading && <Loader2 size={22} className="animate-spin" />}
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}
