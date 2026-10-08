# SIMPA Harapan — Sistem Manajemen Panti Asuhan

**Open Source oleh MZF - 2026**

Sistem manajemen panti asuhan untuk anak yatim piatu: kelola data anak asuh,
pemenuhan kebutuhan dasar, kasus perlindungan, dan catatan kesehatan dalam satu
sistem yang rapi, sederhana, dan bebas iklan.

---

## Tentang

**SIMPA Harapan** adalah aplikasi web full-stack yang membantu pengasuh dan
petugas panti asuhan mencatat dan memantau:

- **Data Anak** — profil lengkap anak asuh (identitas, pendidikan, kamar, status, riwayat).
- **Kebutuhan Dasar** — pemenuhan pangan, sandang, papan, pendidikan, dan perlengkapan dengan prioritas dan target.
- **Perlindungan Anak** — pencatatan dan penanganan kasus perlindungan beserta tingkat risiko dan penanggung jawab.
- **Kesehatan** — jadwal pemeriksaan, imunisasi, pemantauan gizi, dan riwayat kesehatan.
- **Dashboard** — ringkasan kondisi panti: anak aktif, kebutuhan tertunda, kasus aktif, dan jadwal kesehatan.

Aplikasi ini berbasis sesi (login) sehingga data hanya dapat diakses oleh pengguna
yang terdaftar. Proses deploy ditujukan untuk **Vercel** dengan basis data
**Neon (PostgreSQL)**.

## Teknologi

- **Next.js 16** (App Router, Turbopack) — React 19
- **TypeScript** (strict mode)
- **Drizzle ORM** + **PostgreSQL** (Neon)
- **Tailwind CSS v4**
- Autentikasi berbasis cookie + scrypt (tanpa library pihak ketiga)
- ESLint + `tsc --noEmit` untuk menjaga kualitas kode

## Prasyarat

- Node.js 18.18 atau lebih baru
- Akun [Neon](https://neon.tech) (basis data PostgreSQL serverless) — atau PostgreSQL lokal
- (Opsional) Akun [Vercel](https://vercel.com) untuk deploy

## Quick start

1. **Clone & install**

   ```bash
   git clone https://github.com/xtrasalafy-commits/full-stack-orphanage-management-system-1-xs.git
   cd full-stack-orphanage-management-system-1-xs
   npm install
   ```

2. **Siapkan variabel lingkungan**

   ```bash
   cp .env.example .env
   ```

   Isi `DATABASE_URL` dengan connection string Neon Anda, contoh:

   ```env
   DATABASE_URL=postgresql://user:password@ep-nama-branch-pooler.region.aws.neon.tech/neondb?sslmode=require
   ```

3. **Buat skema basis data**

   ```bash
   npm run db:push
   ```

   Perintah ini menjalankan `drizzle-kit push` dan membuat seluruh tabel
   (`users`, `sessions`, `children`, `basic_needs`, `protection_cases`, `health_records`).

4. **Isi data contoh**

   ```bash
   npm run db:seed
   ```

   Data contoh bersifat idempoten — hanya diisi jika tabel `users` masih kosong.
   Jika ingin mengulang seeder sepenuhnya, hapus dahulu data yang ada.

5. **Jalankan aplikasi**

   ```bash
   npm run dev
   ```

   Buka http://localhost:3000. Anda akan dialihkan ke halaman login.

## Akun demo

Setelah `npm run db:seed`, dua akun berikut tersedia:

| Email                    | Kata sandi    | Peran    |
| ------------------------ | ------------- | -------- |
| admin@pantiharapan.id    | admin123      | admin    |
| pengasuh@pantiharapan.id | pengasuh123   | pengasuh |

> **Penting:** segera ganti kata sandi akun demo pada penggunaan nyata
> (atau hapus akun tersebut dan daftarkan akun baru melalui halaman register).

## Struktur proyek

```
src/
├── app/
│   ├── (app)/                 # Halaman aplikasi (butuh login)
│   │   ├── dashboard/         # Ringkasan kondisi panti
│   │   ├── anak/              # Data anak + profil detail anak
│   │   ├── kebutuhan/         # Kebutuhan dasar
│   │   ├── perlindungan/      # Kasus perlindungan anak
│   │   └── kesehatan/         # Catatan kesehatan
│   ├── (auth)/                # Login & register
│   ├── api/
│   │   ├── [resource]/        # REST API CRUD generik untuk tiap modul
│   │   ├── auth/              # login, register, logout
│   │   └── health/            # Pemeriksaan koneksi basis data
│   ├── layout.tsx             # Root layout (juga memasang widget Trakteer)
│   └── page.tsx               # Arahkan ke /login atau /dashboard
├── components/
│   ├── AppShell.tsx           # Sidebar + topbar
│   ├── AuthForm.tsx           # Form login/register
│   ├── ResourceManager.tsx    # Tabel + filter + CRUD untuk semua modul
│   ├── TrakteerWidget.tsx     # Floating widget traktiran + QR + download source
│   └── ui.tsx                 # Komponen UI dasar (Badge, Modal, Toast, ikon)
├── db/
│   ├── schema.ts              # Skema Drizzle (sumber kebenaran)
│   ├── seed.ts                # Data contoh
│   └── index.ts               # Koneksi pool (serverless-safe)
└── lib/
    ├── auth.ts                # Sesi & cookie
    ├── password.ts            # Hash & verifikasi password (scrypt)
    ├── data.ts                # Query helper tiap modul
    ├── resources.ts           # Metadata & validasi tiap modul
    └── format.ts              # Format tanggal, rupiah, dll.
```

## Basis data

Skema didefinisikan dengan Drizzle ORM di `src/db/schema.ts`. Terdapat 6 tabel:

- `users` — pengguna (admin/pengasuh)
- `sessions` — sesi login (token di-hash SHA-256)
- `children` — data anak asuh
- `basic_needs` — kebutuhan dasar
- `protection_cases` — kasus perlindungan
- `health_records` — catatan kesehatan

Koneksi diatur di `src/db/index.ts`: pool dibuat **lambat** (lazy) sehingga proses
build tidak memerlukan `DATABASE_URL`, dan SSL diaktifkan otomatis untuk connection
string dengan `sslmode=require` (seperti Neon).

Migrasi tersimpan di folder `drizzle/` (`0000_init.sql`).

## Deploy ke Vercel + Neon

1. Buat project baru di Neon, salin **connection string** (Pooled connection).
2. Push repository ini ke GitHub.
3. Import repository ke [Vercel](https://vercel.com/new) (framework: **Next.js**
   akan terdeteksi otomatis).
4. Tambahkan Environment Variable:

   | Nama          | Nilai                                            |
   | ------------- | ------------------------------------------------ |
   | `DATABASE_URL`| connection string Neon Anda                      |

   Berlaku untuk environment **Production** dan **Preview**.

5. Klik **Deploy**. Vercel menjalankan `npm run build` (yang juga membangun
   arsip source code, lihat di bawah).
6. Pastikan skema sudah dibuat di Neon sebelum aplikasi pertama kali digunakan:

   ```bash
   npm run db:push
   npm run db:seed
   ```

   (Jalankan dari mesin Anda dengan `DATABASE_URL` Neon, atau gunakan console Neon.)

Endpoint `/api/health` dapat dipakai untuk memverifikasi koneksi basis data
setelah deploy: `GET https://domain-anda.vercel.app/api/health` → `{"ok":true}`.

## Download source code

Aplikasi ini sepenuhnya open source. Anda bisa mengunduh source code lengkapnya
langsung dari aplikasi yang sedang berjalan:

- **Dari widget Trakteer** (pojok kanan bawah) → buka panel →
  tautan **“Download source code”**.
- **Langsung:** `https://domain-anda.vercel.app/simpa-harapan-source.zip`

Arsip `simpa-harapan-source.zip` dibangun otomatis sebelum setiap `next build`
(melalui npm hook `prebuild`, lihat `scripts/build-assets.mjs`), jadi isinya
selalu cocok dengan source code yang sedang dijalankan. Atau unduh langsung dari
GitHub: [repository ini](https://github.com/xtrasalafy-commits/full-stack-orphanage-management-system-1-xs).

## Dukung proyek ini

Web app ini gratis & bebas iklan. **Kopi kecil, server tetap jalan.** ☕

Klik widget Trakteer di pojok kanan bawah layar, pilih nominal (mulai dari
Rp6.000 dan kelipatannya), lalu scan QR atau lanjutkan pembayaran di
[trakteer.id/perpus_opera](https://trakteer.id/perpus_opera/).

Terima kasih atas dukungan Anda!

## Pengembangan

```bash
npm run dev          # Mode pengembangan
npm run typecheck    # Pemeriksaan tipe TypeScript
npm run lint         # ESLint
npm run build        # Build produksi (+ bangun arsip source)
npm run db:studio    # Drizzle Studio (kelola data lewat UI)
```

## Lisensi

MIT License — Copyright (c) 2026 MZF

Lihat file [LICENSE](./LICENSE).

---

**Open Source oleh MZF - 2026**
