import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "SIMPA Harapan — Sistem Manajemen Panti Asuhan",
  description:
    "Sistem manajemen panti asuhan untuk anak yatim piatu: kebutuhan dasar, perlindungan, dan kesehatan.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-900 antialiased">{children}</body>
    </html>
  );
}
