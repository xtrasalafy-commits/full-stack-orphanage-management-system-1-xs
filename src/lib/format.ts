export function formatDate(value?: string | null): string {
  if (!value) return "—";
  const d = new Date(value + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function formatRupiah(value?: number | null): string {
  if (value === null || value === undefined) return "—";
  return "Rp " + value.toLocaleString("id-ID");
}

export function calcAge(birthDate?: string | null): string {
  if (!birthDate) return "—";
  const b = new Date(birthDate + "T00:00:00");
  const now = new Date();
  let years = now.getFullYear() - b.getFullYear();
  const m = now.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < b.getDate())) years--;
  if (years < 1) {
    const months = Math.max(0, (now.getFullYear() - b.getFullYear()) * 12 + now.getMonth() - b.getMonth());
    return `${months} bln`;
  }
  return `${years} thn`;
}

export function todayISO(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

const TONES: Record<string, string> = {
  // generic statuses
  Aktif: "emerald",
  Terpenuhi: "emerald",
  Selesai: "emerald",
  Diproses: "sky",
  "Dalam Penanganan": "sky",
  Terjadwal: "sky",
  Dibutuhkan: "amber",
  Terbuka: "rose",
  Dibatalkan: "slate",
  Mandiri: "violet",
  Diadopsi: "violet",
  "Dikembalikan ke Keluarga": "slate",
  // priority / severity
  Rendah: "slate",
  Sedang: "sky",
  Tinggi: "amber",
  Mendesak: "rose",
  Kritis: "rose",
};

export function toneFor(value?: string | null): string {
  return (value && TONES[value]) || "slate";
}
