"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon, Spinner, ToastProvider } from "@/components/ui";
import { initials } from "@/lib/format";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/anak", label: "Data Anak", icon: "users" },
  { href: "/kebutuhan", label: "Kebutuhan Dasar", icon: "basket" },
  { href: "/perlindungan", label: "Perlindungan", icon: "shield" },
  { href: "/kesehatan", label: "Kesehatan", icon: "health" },
];

function Brand() {
  return (
    <div className="flex items-center gap-3 px-5 py-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-lg shadow-teal-900/30">
        <Icon name="home" className="h-5 w-5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-bold text-white">SIMPA Harapan</p>
        <p className="text-xs text-teal-200/70">Panti Asuhan Harapan Bangsa</p>
      </div>
    </div>
  );
}

export default function AppShell({
  user,
  children,
}: {
  user: { name: string; email: string; role: string };
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  const nav = (
    <nav className="flex-1 space-y-1 px-3">
      <p className="px-3 pb-2 pt-3 text-[11px] font-semibold uppercase tracking-wider text-teal-200/50">Menu Utama</p>
      {NAV.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              active
                ? "bg-white/10 text-white shadow-inner ring-1 ring-white/10"
                : "text-teal-100/70 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon name={item.icon} className="h-[18px] w-[18px]" />
            {item.label}
            {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-teal-300" />}
          </Link>
        );
      })}
    </nav>
  );

  const userCard = (
    <div className="m-3 rounded-2xl bg-white/5 p-3 ring-1 ring-white/10">
      <div className="flex items-center gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-400/20 text-xs font-bold text-teal-100">
          {initials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{user.name}</p>
          <p className="truncate text-xs capitalize text-teal-200/60">{user.role}</p>
        </div>
      </div>
      <button
        onClick={logout}
        disabled={loggingOut}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-medium text-teal-100 transition hover:bg-white/10 disabled:opacity-60"
      >
        {loggingOut ? <Spinner className="h-3.5 w-3.5" /> : <Icon name="logout" className="h-4 w-4" />}
        Keluar
      </button>
    </div>
  );

  return (
    <ToastProvider>
      <div className="min-h-screen lg:pl-64">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-teal-950 lg:flex">
          <Brand />
          {nav}
          {userCard}
        </aside>

        {/* Mobile drawer */}
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="fade-in absolute inset-0 bg-slate-900/60" onClick={() => setOpen(false)} />
            <aside className="slide-in relative flex h-full w-72 max-w-[85%] flex-col bg-teal-950">
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 rounded-lg p-1.5 text-teal-200 hover:bg-white/10"
                aria-label="Tutup menu"
              >
                <Icon name="x" />
              </button>
              <Brand />
              {nav}
              {userCard}
            </aside>
          </div>
        )}

        {/* Top bar (mobile) */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur lg:hidden">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100"
            aria-label="Buka menu"
          >
            <Icon name="menu" />
          </button>
          <p className="text-sm font-bold text-teal-900">SIMPA Harapan</p>
          <div className="grid h-8 w-8 place-items-center rounded-full bg-teal-100 text-xs font-bold text-teal-800">
            {initials(user.name)}
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </ToastProvider>
  );
}
