"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { toneFor } from "@/lib/format";

/* ---------- Icons ---------- */
const PATHS: Record<string, string> = {
  dashboard: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
  users: "M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM21 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  basket: "M5 11l4-7M19 11l-4-7M2 11h20l-2 9H4zM9 15v2M15 15v2M12 15v2",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  health: "M12 21s-8-5.5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.5-8 11-8 11zM12 8v6M9 11h6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  menu: "M3 6h18M3 12h18M3 18h18",
  x: "M18 6 6 18M6 6l12 12",
  plus: "M12 5v14M5 12h14",
  search: "M21 21l-4.3-4.3M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z",
  edit: "M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z",
  trash: "M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6",
  check: "M20 6 9 17l-5-5",
  alert: "M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  arrow: "M5 12h14M13 5l7 7-7 7",
  inbox: "M22 12h-6l-2 3h-4l-2-3H2M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z",
  calendar: "M3 5h18v16H3zM16 3v4M8 3v4M3 10h18",
};

export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={PATHS[name] ?? PATHS.alert} />
    </svg>
  );
}

export function Spinner({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- Badge ---------- */
const TONE_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  sky: "bg-sky-50 text-sky-700 ring-sky-600/20",
  amber: "bg-amber-50 text-amber-800 ring-amber-600/25",
  rose: "bg-rose-50 text-rose-700 ring-rose-600/20",
  violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
  slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
};

export function Badge({ value, tone }: { value?: string | null; tone?: string }) {
  if (!value) return <span className="text-slate-400">—</span>;
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
        TONE_CLASSES[tone ?? toneFor(value)]
      }`}
    >
      {value}
    </span>
  );
}

/* ---------- Skeleton / Empty ---------- */
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200/70 ${className}`} />;
}

export function EmptyState({
  title,
  text,
  action,
}: {
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-600">
        <Icon name="inbox" className="h-8 w-8" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

/* ---------- Modal ---------- */
export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal>
      <div className="fade-in absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`pop-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-2xl ${
          wide ? "sm:max-w-2xl" : "sm:max-w-md"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup"
          >
            <Icon name="x" className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

/* ---------- Toasts ---------- */
type Toast = { id: number; message: string; kind: "success" | "error" };
const ToastCtx = createContext<(message: string, kind?: Toast["kind"]) => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((message: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3800);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:items-end sm:pr-6">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pop-in pointer-events-auto flex max-w-sm items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-white shadow-lg ${
              t.kind === "success" ? "bg-slate-900" : "bg-rose-600"
            }`}
          >
            <Icon name={t.kind === "success" ? "check" : "alert"} className="h-4 w-4 shrink-0" />
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
