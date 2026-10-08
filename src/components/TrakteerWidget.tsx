"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/ui";
import { formatRupiah } from "@/lib/format";

export const TRAKTEER_URL = "https://trakteer.id/perpus_opera/";

/** Nominal traktiran, mulai dari Rp6.000 dan kelipatannya. */
const AMOUNTS = [6000, 12000, 18000, 24000, 36000, 60000];

export default function TrakteerWidget() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(12000);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Buka widget traktiran Trakteer"
        className="fixed bottom-5 right-5 z-40 flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-500 px-4 py-3 text-left text-white shadow-lg shadow-teal-900/30 ring-1 ring-white/20 transition hover:from-teal-700 hover:to-emerald-600"
      >
        <Icon name="coffee" className="h-6 w-6 shrink-0" />
        <span className="hidden leading-tight sm:block">
          <span className="block text-[11px] font-medium text-teal-50/90">
            Web app ini gratis &amp; bebas iklan.
          </span>
          <span className="block text-sm font-bold">Kopi kecil, server tetap jalan</span>
        </span>
        <span className="text-sm font-bold sm:hidden">Traktir Kopi</span>
      </button>

      {/* Traktiran panel */}
      {open && (
        <div className="pop-in fixed bottom-20 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm sm:bottom-24 sm:right-5">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center justify-between bg-gradient-to-br from-teal-700 to-emerald-600 px-4 py-3 text-white">
              <div className="flex items-center gap-2">
                <Icon name="coffee" className="h-5 w-5" />
                <span className="font-bold">Traktir Kopi</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Tutup widget traktiran"
                className="rounded-lg p-1.5 transition hover:bg-white/15"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 p-4">
              <p className="text-sm text-slate-600">
                Web app ini gratis &amp; bebas iklan.{" "}
                <strong className="text-slate-900">Kopi kecil, server tetap jalan.</strong>
              </p>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Pilih nominal traktiran
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {AMOUNTS.map((value) => {
                    const active = value === amount;
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setAmount(value)}
                        className={`rounded-xl px-2 py-2 text-sm font-semibold transition ${
                          active
                            ? "bg-teal-600 text-white shadow-sm ring-1 ring-teal-700"
                            : "border border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:text-teal-700"
                        }`}
                      >
                        {formatRupiah(value).replace("Rp ", "Rp")}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 rounded-xl bg-slate-50 p-4">
                <Image
                  src="/qrcode-trakteer.png"
                  alt="QR Code untuk traktiran via Trakteer"
                  width={176}
                  height={176}
                  className="h-44 w-44 rounded-lg bg-white p-1.5 ring-1 ring-slate-200"
                />
                <p className="text-center text-xs text-slate-500">
                  Scan QR untuk traktiran <strong className="text-slate-700">{formatRupiah(amount)}</strong> via Trakteer
                </p>
              </div>

              <a
                href={TRAKTEER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3"
              >
                <Icon name="coffee" className="h-4 w-4" />
                Traktir {formatRupiah(amount)} di Trakteer
              </a>

              <div className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <p className="flex items-center gap-1 text-xs text-slate-500">
                  <Icon name="heart" className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                  Open Source oleh MZF - 2026
                </p>
                <a
                  href="/simpa-harapan-source.zip"
                  download
                  className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline"
                >
                  <Icon name="download" className="h-3.5 w-3.5" />
                  Download source code
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
