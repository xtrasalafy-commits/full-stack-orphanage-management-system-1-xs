"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon, Spinner } from "@/components/ui";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isLogin = mode === "login";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Terjadi kesalahan");
        setLoading(false);
        return;
      }
      router.replace("/dashboard");
      router.refresh();
    } catch {
      setError("Tidak dapat terhubung ke server");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-teal-900 via-teal-800 to-emerald-700 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-emerald-400/10" />
        <div className="relative flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/20">
            <Icon name="home" />
          </div>
          <span className="text-lg font-bold">SIMPA Harapan</span>
        </div>
        <div className="relative max-w-md">
          <h2 className="text-4xl font-bold leading-tight">Setiap anak berhak atas kasih sayang dan perlindungan.</h2>
          <p className="mt-4 text-teal-100/80">
            Kelola data anak asuh, pemenuhan kebutuhan dasar, kasus perlindungan, dan kesehatan dalam satu sistem
            yang rapi dan terpercaya.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-3 text-center text-xs">
            {[
              ["Kebutuhan Dasar", "basket"],
              ["Perlindungan", "shield"],
              ["Kesehatan", "health"],
            ].map(([label, icon]) => (
              <div key={label} className="rounded-xl bg-white/10 p-3 ring-1 ring-white/10">
                <Icon name={icon} className="mx-auto mb-1.5 h-5 w-5 text-teal-200" />
                {label}
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-teal-200/60">© Panti Asuhan Harapan Bangsa</p>
      </div>

      <div className="flex items-center justify-center bg-slate-50 px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-600 text-white">
              <Icon name="home" />
            </div>
            <span className="font-bold text-teal-900">SIMPA Harapan</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{isLogin ? "Selamat datang kembali" : "Buat akun baru"}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {isLogin ? "Masuk untuk mengelola data panti asuhan." : "Daftar sebagai pengasuh / petugas panti."}
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            {!isLogin && (
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama Anda" required />
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@pantiharapan.id"
                required
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Kata Sandi</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "••••••••" : "Minimal 6 karakter"}
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-3 py-2.5 text-sm text-rose-700 ring-1 ring-rose-200">
                <Icon name="alert" className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full py-3">
              {loading && <Spinner />}
              {isLogin ? "Masuk" : "Daftar"}
            </button>
          </form>

          {isLogin && (
            <div className="mt-6 rounded-xl border border-dashed border-teal-300 bg-teal-50/60 p-4 text-sm">
              <p className="font-semibold text-teal-900">Akun demo</p>
              <p className="mt-1 text-teal-800/80">admin@pantiharapan.id · admin123</p>
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-teal-700 underline-offset-2 hover:underline"
                onClick={() => {
                  setEmail("admin@pantiharapan.id");
                  setPassword("admin123");
                }}
              >
                Isi otomatis
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-500">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <Link href={isLogin ? "/register" : "/login"} className="font-semibold text-teal-700 hover:underline">
              {isLogin ? "Daftar" : "Masuk"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
