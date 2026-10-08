/**
 * Build-time asset generation:
 *   1. `public/qrcode-trakteer.png`  — QR code menuju halaman Trakteer
 *   2. `public/simpa-harapan-source.zip` — arsip source code lengkap aplikasi
 *
 * Berjalan otomatis sebelum `next dev` (hook `predev`) dan `next build`
 * (hook `prebuild`), sehingga kedua aset selalu ada dan cocok dengan source
 * yang sedang dijalankan.
 */
import { ZipArchive } from "archiver";
import QRCode from "qrcode";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public");
const TRAKTEER_URL = "https://trakteer.id/perpus_opera/";

fs.mkdirSync(outDir, { recursive: true });

/* ---------- 1. QR code ---------- */
const dataUrl = await QRCode.toDataURL(TRAKTEER_URL, {
  width: 256,
  margin: 2,
  errorCorrectionLevel: "M",
  color: { dark: "#115e59", light: "#ffffff" },
});
fs.writeFileSync(
  path.join(outDir, "qrcode-trakteer.png"),
  Buffer.from(dataUrl.split(",")[1], "base64"),
);
console.log("✓ QR code written → public/qrcode-trakteer.png");

/* ---------- 2. Source code archive ---------- */
const ENTRIES = [
  "src",
  "scripts",
  "drizzle",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "drizzle.config.json",
  "eslint.config.mjs",
  "postcss.config.mjs",
  ".env.example",
  ".gitignore",
  ".gitattributes",
  "README.md",
  "LICENSE",
];

const outFile = path.join(outDir, "simpa-harapan-source.zip");
const output = fs.createWriteStream(outFile);
const archive = new ZipArchive({ zlib: { level: 9 } });

await new Promise((resolve, reject) => {
  output.on("close", resolve);
  output.on("error", reject);
  archive.on("error", reject);
  archive.pipe(output);
  for (const name of ENTRIES) {
    const p = path.join(root, name);
    if (!fs.existsSync(p)) continue;
    const stat = fs.statSync(p);
    if (stat.isDirectory()) archive.directory(p, name);
    else archive.file(p, { name });
  }
  archive.finalize().catch(reject);
});

const kb = Math.round((archive.pointer() / 1024) * 10) / 10;
console.log(`✓ Source bundle written → public/simpa-harapan-source.zip (${kb} KB)`);
