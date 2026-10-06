import { count } from "drizzle-orm";
import { db } from "@/db";
import { basicNeeds, children, healthRecords, protectionCases, users } from "@/db/schema";
import { hashPassword } from "@/lib/auth";

const pad = (n: number) => String(n).padStart(2, "0");
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
/** Date offset by N days from today (negative = past). */
const day = (offset: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return iso(d);
};
/** Date N years (and extra days) ago. */
const ago = (years: number, extraDays = 0) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  d.setDate(d.getDate() - extraDays);
  return iso(d);
};

export const DEMO_ADMIN = { email: "admin@pantiharapan.id", password: "admin123" };

let seeding: Promise<void> | null = null;

export function ensureSeed(): Promise<void> {
  if (!seeding) {
    seeding = runSeed().catch((e) => {
      seeding = null;
      throw e;
    });
  }
  return seeding;
}

async function runSeed() {
  const [{ value }] = await db.select({ value: count() }).from(users);
  if (value > 0) return;

  await db.insert(users).values([
    { name: "Ibu Siti Rahmawati", email: DEMO_ADMIN.email, passwordHash: hashPassword(DEMO_ADMIN.password), role: "admin" },
    { name: "Bapak Ahmad Fauzi", email: "pengasuh@pantiharapan.id", passwordHash: hashPassword("pengasuh123"), role: "pengasuh" },
  ]);

  // [name, gender, age, place, orphan, yearsInPanti, education, school, room, blood, status, background, healthNotes]
  type C = [string, string, number, string, string, number, string, string, string, string, string, string, string];
  const kids: C[] = [
    ["Muhammad Rizky Pratama", "Laki-laki", 14, "Bekasi", "Yatim Piatu", 6, "SMP", "SMPN 12 Bekasi", "Asrama Putra A", "O", "Aktif", "Kedua orang tua meninggal dalam kecelakaan lalu lintas. Sempat diasuh paman sebelum dititipkan ke panti karena kendala ekonomi.", "Alergi udang dan makanan laut."],
    ["Aisyah Nur Azizah", "Perempuan", 10, "Bogor", "Yatim Piatu", 4, "SD", "SDN Pakuan 2", "Asrama Putri B", "A", "Aktif", "Ayah wafat karena sakit jantung, ibu wafat setelah melahirkan adik. Tidak ada kerabat yang sanggup mengasuh.", "Asma ringan, perlu inhaler cadangan."],
    ["Dimas Aditya Saputra", "Laki-laki", 7, "Jakarta Timur", "Yatim Piatu", 3, "SD", "SDN 05 Cipinang", "Asrama Putra B", "B", "Aktif", "Orang tua meninggal saat banjir besar. Ditemukan petugas kelurahan dan dirujuk ke panti.", "Berat badan di bawah rata-rata, dalam pemantauan gizi."],
    ["Siti Khoirunnisa", "Perempuan", 16, "Depok", "Yatim Piatu", 9, "SMA/SMK", "SMK Kesehatan Bhakti", "Asrama Putri A", "AB", "Aktif", "Menjadi yatim piatu sejak kelas 3 SD. Berprestasi di bidang akademik dan bercita-cita menjadi perawat.", "Tidak ada riwayat penyakit khusus."],
    ["Fajar Ramadhan", "Laki-laki", 12, "Tangerang", "Yatim", 5, "SMP", "SMPN 3 Tangerang", "Asrama Putra A", "O", "Aktif", "Ayah meninggal, ibu mengalami gangguan jiwa sehingga tidak dapat mengasuh. Kunjungan ibu didampingi pekerja sosial.", "Riwayat tipes, kontrol berkala."],
    ["Putri Amelia", "Perempuan", 5, "Jakarta Selatan", "Yatim Piatu", 2, "PAUD/TK", "TK Pertiwi", "Asrama Putri B", "A", "Aktif", "Ditinggalkan orang tua yang wafat akibat COVID-19. Nenek sudah lanjut usia dan tidak mampu merawat.", "Imunisasi lanjutan belum lengkap."],
    ["Andi Wijaya", "Laki-laki", 17, "Bandung", "Yatim Piatu", 11, "SMA/SMK", "SMKN 2 Bandung (Teknik Otomotif)", "Asrama Putra A", "B", "Aktif", "Masuk panti sejak usia 6 tahun. Aktif sebagai ketua OSIS dan sedang mempersiapkan program kemandirian.", "Tidak ada."],
    ["Nabila Zahra", "Perempuan", 9, "Jakarta Barat", "Yatim Piatu", 3, "SD", "SDN 11 Kembangan", "Asrama Putri B", "O", "Aktif", "Orang tua meninggal karena kebakaran permukiman. Pernah mengalami trauma dan mendapat pendampingan psikolog.", "Gangguan tidur akibat trauma, pantau berkala."],
    ["Bagas Setiawan", "Laki-laki", 3, "Bekasi", "Yatim Piatu", 1, "Belum Sekolah", "", "Ruang Balita", "A", "Aktif", "Bayi ditemukan bersama neneknya yang kemudian wafat. Belum ada keluarga yang dapat dihubungi.", "Dalam pemantauan tumbuh kembang, alergi susu sapi."],
    ["Salsabila Putri", "Perempuan", 13, "Cianjur", "Yatim Piatu", 7, "SMP", "SMPN 1 Cianjur", "Asrama Putri A", "B", "Aktif", "Kehilangan orang tua akibat gempa Cianjur. Dirujuk dari posko pengungsian.", "Rabun jauh ringan, memerlukan kacamata."],
    ["Reza Maulana", "Laki-laki", 19, "Garut", "Yatim Piatu", 13, "Kuliah", "Politeknik Negeri Bandung", "Mess Mandiri", "O", "Mandiri", "Telah menyelesaikan masa pengasuhan dan menjalani program kemandirian sambil berkuliah dengan beasiswa.", "Tidak ada."],
    ["Alya Rahmawati", "Perempuan", 8, "Bogor", "Piatu", 4, "SD", "SDN Sukasari 1", "Asrama Putri B", "A", "Diadopsi", "Telah diadopsi oleh keluarga sesuai prosedur hukum dan pengawasan Dinas Sosial.", "Tidak ada."],
  ];

  const kidRows = await db
    .insert(children)
    .values(
      kids.map(([fullName, gender, age, birthPlace, orphanType, years, education, schoolName, room, bloodType, status, background, healthNotes], i) => ({
        fullName,
        gender,
        birthDate: ago(age, 20 + i * 23),
        birthPlace,
        orphanType,
        entryDate: ago(years, 10 + i * 17),
        education,
        schoolName: schoolName || null,
        room,
        bloodType,
        status,
        background,
        healthNotes,
      })),
    )
    .returning({ id: children.id });
  const id = (i: number) => kidRows[i].id;

  // [child, category, item, priority, status, cost, dueOffset, notes]
  type N = [number, string, string, string, string, number | null, number | null, string | null];
  const needs: N[] = [
    [0, "Pendidikan", "Seragam sekolah SMP (2 stel)", "Tinggi", "Diproses", 450000, 5, "Menunggu donasi dari yayasan mitra."],
    [0, "Perlengkapan Pribadi", "Sepatu sekolah hitam ukuran 40", "Sedang", "Dibutuhkan", 220000, 14, null],
    [1, "Kesehatan", "Inhaler cadangan dan obat asma", "Mendesak", "Dibutuhkan", 180000, 2, "Persediaan tinggal untuk 3 hari."],
    [2, "Makanan & Gizi", "Paket makanan tambahan (PMT) 3 bulan", "Mendesak", "Diproses", 900000, 7, "Rekomendasi ahli gizi Puskesmas."],
    [2, "Pakaian", "Pakaian harian 5 stel", "Sedang", "Dibutuhkan", 350000, 21, null],
    [3, "Pendidikan", "Biaya praktik kerja lapangan (PKL)", "Tinggi", "Dibutuhkan", 750000, 30, "Praktik di RS umum daerah."],
    [3, "Perlengkapan Pribadi", "Seragam praktik perawat", "Tinggi", "Terpenuhi", 400000, -10, "Dari donatur Ibu Hartati."],
    [4, "Kesehatan", "Kontrol tipes dan vitamin", "Sedang", "Terpenuhi", 150000, -5, null],
    [5, "Pendidikan", "Tas, buku, dan alat tulis TK", "Sedang", "Terpenuhi", 200000, -20, null],
    [5, "Kesehatan", "Imunisasi lanjutan (DPT booster)", "Tinggi", "Diproses", 250000, 9, "Dijadwalkan di Puskesmas Tebet."],
    [6, "Pendidikan", "Biaya kursus mengemudi & sertifikasi bengkel", "Tinggi", "Dibutuhkan", 1500000, 45, "Persiapan program kemandirian."],
    [6, "Tempat Tinggal", "Perbaikan lemari dan tempat tidur asrama", "Rendah", "Dibutuhkan", 300000, 40, null],
    [7, "Kesehatan", "Sesi konseling lanjutan", "Tinggi", "Diproses", 400000, 12, "Bekerja sama dengan psikolog klinis."],
    [7, "Pakaian", "Jaket dan pakaian hangat", "Rendah", "Terpenuhi", 280000, -30, null],
    [8, "Makanan & Gizi", "Susu formula hipoalergenik (6 kaleng)", "Mendesak", "Dibutuhkan", 1260000, 3, "Alergi susu sapi, tidak boleh diganti."],
    [8, "Perlengkapan Pribadi", "Popok dan perlengkapan mandi bayi", "Tinggi", "Diproses", 320000, 6, null],
    [9, "Kesehatan", "Kacamata minus 1.5", "Tinggi", "Dibutuhkan", 450000, 10, "Hasil pemeriksaan optik bulan lalu."],
    [9, "Pendidikan", "Buku paket kelas 8", "Sedang", "Diproses", 380000, 15, null],
    [1, "Pendidikan", "Les tambahan matematika", "Rendah", "Dibutuhkan", 200000, 60, null],
    [4, "Pakaian", "Pakaian olahraga dan sepatu futsal", "Rendah", "Dibutuhkan", 260000, 35, null],
    [10, "Tempat Tinggal", "Biaya kos bulanan dekat kampus", "Tinggi", "Diproses", 600000, 8, "Dukungan transisi kemandirian."],
    [3, "Makanan & Gizi", "Tablet tambah darah", "Sedang", "Terpenuhi", 60000, -12, null],
    [7, "Tempat Tinggal", "Lampu tidur dan kelambu kamar", "Rendah", "Terpenuhi", 120000, -25, "Membantu mengatasi gangguan tidur."],
    [2, "Pendidikan", "Paket buku bacaan anak", "Rendah", "Dibutuhkan", 150000, 28, null],
  ];
  await db.insert(basicNeeds).values(
    needs.map(([c, category, item, priority, status, estimatedCost, due, notes]) => ({
      childId: id(c),
      category,
      item,
      priority,
      status,
      estimatedCost,
      dueDate: due === null ? null : day(due),
      notes,
    })),
  );

  // [child, type, severity, status, reportedDaysAgo, handler, description, action]
  type P = [number, string, string, string, number, string, string, string | null];
  const cases: P[] = [
    [7, "Trauma / Psikologis", "Tinggi", "Dalam Penanganan", 38, "Psikolog Dewi Lestari, M.Psi", "Nabila sering terbangun malam hari karena mimpi buruk terkait kebakaran yang merenggut orang tuanya dan menunjukkan kecemasan saat mendengar sirine.", "Konseling mingguan, lampu tidur di kamar, pendampingan pengasuh malam."],
    [2, "Perundungan (Bullying)", "Sedang", "Dalam Penanganan", 16, "Pak Ahmad Fauzi (Pengasuh)", "Dimas dilaporkan diejek oleh teman sekolah karena tinggal di panti dan postur tubuhnya kecil. Anak menjadi murung dan enggan berangkat sekolah.", "Koordinasi dengan wali kelas, sesi penguatan percaya diri, pemantauan harian."],
    [4, "Dokumen & Hukum", "Sedang", "Terbuka", 9, "Ibu Siti Rahmawati", "Fajar belum memiliki akta kelahiran dan Kartu Identitas Anak (KIA). Dokumen diperlukan untuk pendaftaran SMA dan program bantuan.", null],
    [8, "Pengawasan Pengasuhan", "Tinggi", "Terbuka", 4, "Ibu Siti Rahmawati", "Penelusuran keluarga Bagas oleh Dinas Sosial belum membuahkan hasil. Diperlukan pengawasan ketat dan penetapan status hukum pengasuhan.", null],
    [0, "Kekerasan Emosional", "Rendah", "Selesai", 90, "Pekerja Sosial Rina Marlina", "Rizky sempat dimarahi berlebihan oleh pengasuh pengganti sehingga menarik diri. Kasus sudah dimediasi dan pengasuh diberi pembinaan.", "Mediasi, pembinaan pengasuh, evaluasi 3 bulan menunjukkan perbaikan."],
    [5, "Dokumen & Hukum", "Rendah", "Selesai", 120, "Ibu Siti Rahmawati", "Pengurusan akta kematian orang tua dan Kartu Keluarga baru untuk Putri.", "Dokumen selesai diterbitkan Dukcapil."],
    [9, "Pengawasan Pengasuhan", "Sedang", "Dalam Penanganan", 21, "Pekerja Sosial Rina Marlina", "Kerabat jauh Salsabila mengajukan kunjungan dan keinginan mengasuh. Diperlukan asesmen kelayakan keluarga.", "Home visit dijadwalkan, asesmen psikososial berjalan."],
    [3, "Kekerasan Fisik", "Kritis", "Selesai", 150, "Pekerja Sosial Rina Marlina", "Siti pernah menunjukkan luka memar yang diduga akibat kekerasan oleh pihak luar saat kegiatan di luar panti. Pelaku telah ditindak.", "Visum, pelaporan ke PPA Polres, pendampingan hukum dan psikologis selesai."],
  ];
  await db.insert(protectionCases).values(
    cases.map(([c, type, severity, status, daysAgo, handler, description, actionTaken]) => ({
      childId: id(c),
      type,
      severity,
      status,
      reportedDate: day(-daysAgo),
      handler,
      description,
      actionTaken,
    })),
  );

  // [child, type, status, checkOffset, weight, height, diagnosis, handler, nextOffset, notes]
  type H = [number, string, string, number, number | null, number | null, string | null, string | null, number | null, string | null];
  const health: H[] = [
    [0, "Pemeriksaan Rutin", "Selesai", -40, 48, 158, "Sehat, gizi baik", "dr. Anisa (Puskesmas Bekasi)", 140, null],
    [1, "Pemeriksaan Rutin", "Selesai", -25, 29, 133, "Asma ringan terkontrol", "dr. Anisa (Puskesmas Bekasi)", 65, "Lanjutkan penggunaan inhaler saat perlu."],
    [2, "Pemantauan Gizi", "Selesai", -14, 18, 115, "Gizi kurang (BB/TB -2SD)", "Ahli Gizi Maya Sari", 14, "Mulai program PMT."],
    [2, "Pemantauan Gizi", "Terjadwal", 14, null, null, null, "Ahli Gizi Maya Sari", null, "Evaluasi hasil PMT 2 minggu."],
    [3, "Pemeriksaan Rutin", "Selesai", -60, 50, 160, "Sehat", "dr. Anisa (Puskesmas Bekasi)", 120, null],
    [4, "Sakit", "Selesai", -35, 38, 146, "Demam tifoid", "dr. Bambang (RS Mitra)", -5, "Rawat jalan 2 minggu, istirahat cukup."],
    [4, "Pemeriksaan Rutin", "Terjadwal", 6, null, null, null, "dr. Anisa (Puskesmas Bekasi)", null, "Kontrol pasca tipes."],
    [5, "Imunisasi", "Terjadwal", 9, null, null, "DPT booster", "Bidan Lilis (Puskesmas Tebet)", null, "Bawa buku KIA."],
    [5, "Pemeriksaan Gigi", "Selesai", -45, 17, 106, "Karies gigi susu ringan", "drg. Putu", 135, null],
    [6, "Pemeriksaan Rutin", "Terjadwal", 3, null, null, null, "dr. Anisa (Puskesmas Bekasi)", null, "Cek kesehatan sebelum kursus."],
    [7, "Konseling Psikologis", "Selesai", -7, 27, 130, "Gangguan tidur akibat trauma, membaik", "Psikolog Dewi Lestari, M.Psi", 7, "Sesi terapi bermain."],
    [7, "Konseling Psikologis", "Terjadwal", 7, null, null, null, "Psikolog Dewi Lestari, M.Psi", null, null],
    [8, "Pemantauan Gizi", "Selesai", -10, 13.5, 93, "Alergi susu sapi, pertumbuhan normal", "dr. Sp.A Hendra", 20, "Gunakan susu hipoalergenik."],
    [8, "Imunisasi", "Terjadwal", 20, null, null, "Campak booster", "dr. Sp.A Hendra", null, null],
    [9, "Pemeriksaan Rutin", "Selesai", -30, 42, 152, "Miopia ringan (OD -1.5, OS -1.25)", "Optik Sehat Cianjur", 11, "Perlu kacamata."],
    [9, "Pemeriksaan Rutin", "Terjadwal", 11, null, null, null, "Optik Sehat Cianjur", null, "Pengambilan kacamata."],
    [10, "Pemeriksaan Rutin", "Selesai", -80, 62, 170, "Sehat", "Klinik Kampus", 100, null],
    [6, "Pemeriksaan Gigi", "Dibatalkan", -3, null, null, null, "drg. Putu", null, "Dijadwalkan ulang karena dokter berhalangan."],
  ];
  await db.insert(healthRecords).values(
    health.map(([c, type, status, checkOffset, weightKg, heightCm, diagnosis, handler, nextOffset, notes]) => ({
      childId: id(c),
      type,
      status,
      checkDate: day(checkOffset),
      weightKg,
      heightCm,
      diagnosis,
      handler,
      nextCheckDate: nextOffset === null ? null : day(nextOffset),
      notes,
    })),
  );
}
