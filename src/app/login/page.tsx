"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, UserPlus } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: isRegistering ? "register" : "login", name, email, password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setError(result.error ?? "Não foi possível concluir o acesso.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Não foi possível conectar ao servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-180px)] flex items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-3xl border border-[#59107b]/70 bg-[#17032a] p-6 sm:p-8 shadow-2xl shadow-[#be007a]/10">
        <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-purple-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Voltar para o início
        </Link>
        <div className="mb-6">
          <p className="text-sm font-semibold text-[#f43f9e]">DinoPédia</p>
          <h1 className="mt-1 text-3xl font-black text-white">
            {isRegistering ? "Crie sua conta" : "Acesse sua conta"}
          </h1>
          <p className="mt-2 text-sm text-purple-300">
            Salve seu progresso e participe da comunidade.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <label className="block text-sm text-purple-200">
              Nome
              <input value={name} onChange={(event) => setName(event.target.value)} required minLength={2} className="mt-1 w-full rounded-xl border border-[#59107b] bg-[#0d0118] px-3 py-2.5 text-white outline-none focus:border-[#f43f9e]" />
            </label>
          )}
          <label className="block text-sm text-purple-200">
            E-mail
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1 w-full rounded-xl border border-[#59107b] bg-[#0d0118] px-3 py-2.5 text-white outline-none focus:border-[#f43f9e]" />
          </label>
          <label className="block text-sm text-purple-200">
            Senha
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} className="mt-1 w-full rounded-xl border border-[#59107b] bg-[#0d0118] px-3 py-2.5 text-white outline-none focus:border-[#f43f9e]" />
          </label>
          {error && <p className="rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</p>}
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#be007a] to-[#7f0657] px-4 py-3 font-semibold text-white transition hover:from-[#d8008b] disabled:cursor-not-allowed disabled:opacity-60">
            {isRegistering ? <UserPlus className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
            {loading ? "Aguarde..." : isRegistering ? "Criar conta" : "Entrar"}
          </button>
        </form>

        <button onClick={() => { setIsRegistering(!isRegistering); setError(""); }} className="mt-6 w-full text-center text-sm text-purple-300 hover:text-[#f43f9e]">
          {isRegistering ? "Já tenho uma conta" : "Ainda não tenho uma conta"}
        </button>
      </section>
    </main>
  );
}
