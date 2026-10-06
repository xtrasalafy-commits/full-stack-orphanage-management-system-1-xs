export type FieldType = "text" | "textarea" | "select" | "date" | "number" | "child";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  placeholder?: string;
  full?: boolean;
  defaultValue?: string;
};

export type ResourceKey = "children" | "needs" | "cases" | "checkups";

export type ResourceMeta = {
  key: ResourceKey;
  title: string;
  singular: string;
  description: string;
  fields: Field[];
  statusField: string;
  statusOptions: string[];
  searchFields: string[];
  emptyTitle: string;
  emptyText: string;
};

export const RESOURCE_KEYS: ResourceKey[] = ["children", "needs", "cases", "checkups"];

export const resources: Record<ResourceKey, ResourceMeta> = {
  children: {
    key: "children",
    title: "Data Anak",
    singular: "Anak",
    description: "Profil lengkap anak asuh yang tinggal di panti.",
    statusField: "status",
    statusOptions: ["Aktif", "Dikembalikan ke Keluarga", "Diadopsi", "Mandiri"],
    searchFields: ["fullName", "room", "schoolName", "birthPlace"],
    emptyTitle: "Belum ada data anak",
    emptyText: "Tambahkan anak asuh pertama untuk mulai mencatat kebutuhan dan perlindungannya.",
    fields: [
      { name: "fullName", label: "Nama Lengkap", type: "text", required: true, full: true, placeholder: "Contoh: Muhammad Rizky" },
      { name: "gender", label: "Jenis Kelamin", type: "select", required: true, options: ["Laki-laki", "Perempuan"] },
      { name: "orphanType", label: "Status Orang Tua", type: "select", required: true, options: ["Yatim Piatu", "Yatim", "Piatu"], defaultValue: "Yatim Piatu" },
      { name: "birthPlace", label: "Tempat Lahir", type: "text", placeholder: "Kota/Kabupaten" },
      { name: "birthDate", label: "Tanggal Lahir", type: "date", required: true },
      { name: "entryDate", label: "Tanggal Masuk Panti", type: "date", required: true },
      { name: "room", label: "Kamar / Asrama", type: "text", placeholder: "Contoh: Asrama Putra A" },
      { name: "education", label: "Jenjang Pendidikan", type: "select", options: ["Belum Sekolah", "PAUD/TK", "SD", "SMP", "SMA/SMK", "Kuliah"] },
      { name: "schoolName", label: "Nama Sekolah", type: "text", placeholder: "Contoh: SDN 03 Menteng" },
      { name: "bloodType", label: "Golongan Darah", type: "select", options: ["A", "B", "AB", "O", "Tidak Diketahui"] },
      { name: "status", label: "Status", type: "select", required: true, options: ["Aktif", "Dikembalikan ke Keluarga", "Diadopsi", "Mandiri"], defaultValue: "Aktif" },
      { name: "background", label: "Latar Belakang", type: "textarea", full: true, placeholder: "Riwayat keluarga, penyebab masuk panti, wali/kerabat..." },
      { name: "healthNotes", label: "Catatan Kesehatan Umum", type: "textarea", full: true, placeholder: "Alergi, penyakit bawaan, kebutuhan khusus..." },
    ],
  },
  needs: {
    key: "needs",
    title: "Kebutuhan Dasar",
    singular: "Kebutuhan",
    description: "Pantau pemenuhan pangan, sandang, papan, pendidikan, dan perlengkapan anak.",
    statusField: "status",
    statusOptions: ["Dibutuhkan", "Diproses", "Terpenuhi"],
    searchFields: ["item", "category", "childName", "notes"],
    emptyTitle: "Belum ada catatan kebutuhan",
    emptyText: "Catat kebutuhan dasar anak agar pemenuhannya dapat dipantau dan diprioritaskan.",
    fields: [
      { name: "childId", label: "Anak", type: "child", required: true, full: true },
      { name: "category", label: "Kategori", type: "select", required: true, options: ["Makanan & Gizi", "Pakaian", "Pendidikan", "Kesehatan", "Tempat Tinggal", "Perlengkapan Pribadi"] },
      { name: "item", label: "Kebutuhan", type: "text", required: true, placeholder: "Contoh: Seragam sekolah baru" },
      { name: "priority", label: "Prioritas", type: "select", required: true, options: ["Rendah", "Sedang", "Tinggi", "Mendesak"], defaultValue: "Sedang" },
      { name: "status", label: "Status", type: "select", required: true, options: ["Dibutuhkan", "Diproses", "Terpenuhi"], defaultValue: "Dibutuhkan" },
      { name: "estimatedCost", label: "Perkiraan Biaya (Rp)", type: "number", placeholder: "0" },
      { name: "dueDate", label: "Target Pemenuhan", type: "date" },
      { name: "notes", label: "Catatan", type: "textarea", full: true },
    ],
  },
  cases: {
    key: "cases",
    title: "Perlindungan Anak",
    description: "Catat dan tangani kasus perlindungan: kekerasan, trauma, perundungan, hingga dokumen hukum.",
    singular: "Kasus",
    statusField: "status",
    statusOptions: ["Terbuka", "Dalam Penanganan", "Selesai"],
    searchFields: ["type", "childName", "handler", "description"],
    emptyTitle: "Belum ada kasus perlindungan",
    emptyText: "Syukurlah, belum ada kasus tercatat. Laporan baru dapat ditambahkan kapan saja.",
    fields: [
      { name: "childId", label: "Anak", type: "child", required: true, full: true },
      { name: "type", label: "Jenis Kasus", type: "select", required: true, options: ["Kekerasan Fisik", "Kekerasan Emosional", "Trauma / Psikologis", "Perundungan (Bullying)", "Dokumen & Hukum", "Pengawasan Pengasuhan", "Lainnya"] },
      { name: "severity", label: "Tingkat Risiko", type: "select", required: true, options: ["Rendah", "Sedang", "Tinggi", "Kritis"], defaultValue: "Sedang" },
      { name: "status", label: "Status", type: "select", required: true, options: ["Terbuka", "Dalam Penanganan", "Selesai"], defaultValue: "Terbuka" },
      { name: "reportedDate", label: "Tanggal Dilaporkan", type: "date", required: true },
      { name: "handler", label: "Penanggung Jawab", type: "text", placeholder: "Pekerja sosial / psikolog" },
      { name: "description", label: "Kronologi / Deskripsi", type: "textarea", required: true, full: true },
      { name: "actionTaken", label: "Tindakan yang Dilakukan", type: "textarea", full: true },
    ],
  },
  checkups: {
    key: "checkups",
    title: "Kesehatan",
    singular: "Catatan Kesehatan",
    description: "Jadwal pemeriksaan, imunisasi, pemantauan gizi, dan riwayat kesehatan anak.",
    statusField: "status",
    statusOptions: ["Terjadwal", "Selesai", "Dibatalkan"],
    searchFields: ["type", "childName", "diagnosis", "handler"],
    emptyTitle: "Belum ada catatan kesehatan",
    emptyText: "Jadwalkan pemeriksaan pertama untuk menjaga kesehatan anak-anak asuh.",
    fields: [
      { name: "childId", label: "Anak", type: "child", required: true, full: true },
      { name: "type", label: "Jenis Pemeriksaan", type: "select", required: true, options: ["Pemeriksaan Rutin", "Imunisasi", "Sakit", "Pemeriksaan Gigi", "Pemantauan Gizi", "Konseling Psikologis"] },
      { name: "status", label: "Status", type: "select", required: true, options: ["Terjadwal", "Selesai", "Dibatalkan"], defaultValue: "Terjadwal" },
      { name: "checkDate", label: "Tanggal Pemeriksaan", type: "date", required: true },
      { name: "nextCheckDate", label: "Pemeriksaan Berikutnya", type: "date" },
      { name: "weightKg", label: "Berat Badan (kg)", type: "number", placeholder: "0" },
      { name: "heightCm", label: "Tinggi Badan (cm)", type: "number", placeholder: "0" },
      { name: "handler", label: "Dokter / Petugas", type: "text", placeholder: "Contoh: dr. Anisa (Puskesmas)" },
      { name: "diagnosis", label: "Diagnosis / Hasil", type: "text", full: true },
      { name: "notes", label: "Catatan", type: "textarea", full: true },
    ],
  },
};

export function isResourceKey(value: string): value is ResourceKey {
  return (RESOURCE_KEYS as string[]).includes(value);
}

export type Row = { id: number; childName?: string | null } & Record<string, string | number | null | undefined | boolean>;

/** Validate & normalise a payload against resource metadata. */
export function parsePayload(
  meta: ResourceMeta,
  body: unknown,
  partial = false,
): { data: Record<string, string | number | null>; error?: string } {
  const data: Record<string, string | number | null> = {};
  if (!body || typeof body !== "object") return { data, error: "Data tidak valid" };
  const input = body as Record<string, unknown>;

  for (const f of meta.fields) {
    if (partial && !(f.name in input)) continue;
    const raw = input[f.name];
    const str = raw === null || raw === undefined ? "" : String(raw).trim();

    if (str === "") {
      if (f.required) return { data, error: `${f.label} wajib diisi` };
      data[f.name] = null;
      continue;
    }
    switch (f.type) {
      case "number": {
        const n = Number(str);
        if (!Number.isFinite(n) || n < 0) return { data, error: `${f.label} harus berupa angka positif` };
        data[f.name] = f.name === "estimatedCost" ? Math.round(n) : n;
        break;
      }
      case "child": {
        const n = Number(str);
        if (!Number.isInteger(n) || n <= 0) return { data, error: `${f.label} tidak valid` };
        data[f.name] = n;
        break;
      }
      case "date":
        if (!/^\d{4}-\d{2}-\d{2}$/.test(str) || Number.isNaN(Date.parse(str))) return { data, error: `${f.label} tidak valid` };
        data[f.name] = str;
        break;
      case "select":
        if (!f.options?.includes(str)) return { data, error: `${f.label} tidak valid` };
        data[f.name] = str;
        break;
      default:
        if (str.length > 2000) return { data, error: `${f.label} terlalu panjang` };
        data[f.name] = str;
    }
  }
  return { data };
}
