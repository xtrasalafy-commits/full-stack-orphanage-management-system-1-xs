import Link from "next/link";
import { Badge, EmptyState, Icon } from "@/components/ui";
import { getCurrentUser } from "@/lib/auth";
import { listResource } from "@/lib/data";
import { formatDate, formatRupiah, todayISO } from "@/lib/format";

export const metadata = { title: "Dashboard — SIMPA Harapan" };

const PRIORITY_RANK: Record<string, number> = { Mendesak: 0, Tinggi: 1, Sedang: 2, Rendah: 3 };
const SEVERITY_RANK: Record<string, number> = { Kritis: 0, Tinggi: 1, Sedang: 2, Rendah: 3 };

function Stat({
  label,
  value,
  hint,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p>
        </div>
        <div className={`grid h-11 w-11 place-items-center rounded-xl ${color}`}>
          <Icon name={icon} />
        </div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

function Card({
  title,
  href,
  children,
}: {
  title: string;
  href?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        {href && (
          <Link href={href} className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 hover:underline">
            Lihat semua <Icon name="arrow" className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-slate-800">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${max ? (value / max) * 100 : 0}%` }} />
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  const [kids, needs, cases, health] = await Promise.all([
    listResource("children"),
    listResource("needs"),
    listResource("cases"),
    listResource("checkups"),
  ]);
  const today = todayISO();

  const activeKids = kids.filter((k) => k.status === "Aktif");
  const openNeeds = needs.filter((n) => n.status !== "Terpenuhi");
  const urgentNeeds = openNeeds.filter((n) => n.priority === "Mendesak");
  const activeCases = cases.filter((c) => c.status !== "Selesai");
  const highCases = activeCases.filter((c) => c.severity === "Tinggi" || c.severity === "Kritis");
  const upcoming = health
    .filter((h) => h.status === "Terjadwal" && String(h.checkDate) >= today)
    .sort((a, b) => String(a.checkDate).localeCompare(String(b.checkDate)));
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);
  const weekCount = upcoming.filter((h) => new Date(String(h.checkDate)) <= nextWeek).length;

  const fulfilled = needs.length - openNeeds.length;
  const fulfilledPct = needs.length ? Math.round((fulfilled / needs.length) * 100) : 0;
  const outstanding = openNeeds.reduce((s, n) => s + (Number(n.estimatedCost) || 0), 0);

  const categories = ["Makanan & Gizi", "Pakaian", "Pendidikan", "Kesehatan", "Tempat Tinggal", "Perlengkapan Pribadi"].map(
    (c) => ({
      c,
      total: needs.filter((n) => n.category === c).length,
      done: needs.filter((n) => n.category === c && n.status === "Terpenuhi").length,
    }),
  );

  const priorityList = [...openNeeds]
    .sort(
      (a, b) =>
        (PRIORITY_RANK[String(a.priority)] ?? 9) - (PRIORITY_RANK[String(b.priority)] ?? 9) ||
        String(a.dueDate ?? "9").localeCompare(String(b.dueDate ?? "9")),
    )
    .slice(0, 5);
  const caseList = [...activeCases]
    .sort((a, b) => (SEVERITY_RANK[String(a.severity)] ?? 9) - (SEVERITY_RANK[String(b.severity)] ?? 9))
    .slice(0, 5);

  const eduGroups = ["Belum Sekolah", "PAUD/TK", "SD", "SMP", "SMA/SMK", "Kuliah"].map((e) => ({
    e,
    n: activeKids.filter((k) => k.education === e).length,
  }));
  const eduMax = Math.max(1, ...eduGroups.map((g) => g.n));
  const boys = activeKids.filter((k) => k.gender === "Laki-laki").length;
  const girls = activeKids.length - boys;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-teal-700">
          {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
          Halo, {user?.name.split(" ").slice(0, 2).join(" ")} 👋
        </h1>
        <p className="mt-1 text-sm text-slate-500">Ringkasan kondisi anak asuh, kebutuhan dasar, dan perlindungan hari ini.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Anak Asuh Aktif" value={activeKids.length} hint={`${boys} laki-laki · ${girls} perempuan · ${kids.length} total tercatat`} icon="users" color="bg-teal-50 text-teal-600" />
        <Stat label="Kebutuhan Belum Terpenuhi" value={openNeeds.length} hint={`${urgentNeeds.length} mendesak · ${formatRupiah(outstanding)} diperlukan`} icon="basket" color="bg-amber-50 text-amber-600" />
        <Stat label="Kasus Perlindungan Aktif" value={activeCases.length} hint={`${highCases.length} berisiko tinggi/kritis`} icon="shield" color="bg-rose-50 text-rose-600" />
        <Stat label="Pemeriksaan Mendatang" value={upcoming.length} hint={`${weekCount} dalam 7 hari ke depan`} icon="health" color="bg-sky-50 text-sky-600" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Kebutuhan Prioritas" href="/kebutuhan">
            {priorityList.length === 0 ? (
              <EmptyState title="Semua kebutuhan terpenuhi" text="Tidak ada kebutuhan yang tertunda saat ini." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {priorityList.map((n) => (
                  <li key={n.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-900">{String(n.item)}</p>
                      <p className="truncate text-xs text-slate-500">
                        {String(n.childName)} · {String(n.category)} · Target {formatDate(n.dueDate as string | null)}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge value={String(n.priority)} />
                      <span className="hidden sm:inline-flex">
                        <Badge value={String(n.status)} />
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Pemenuhan Kebutuhan">
          <div className="space-y-5 p-5">
            <div>
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-slate-900">{fulfilledPct}%</span>
                <span className="text-xs text-slate-500">
                  {fulfilled} dari {needs.length} terpenuhi
                </span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400" style={{ width: `${fulfilledPct}%` }} />
              </div>
            </div>
            <div className="space-y-3">
              {categories.map((c) => (
                <Bar key={c.c} label={`${c.c} (${c.done}/${c.total})`} value={c.total} max={Math.max(1, ...categories.map((x) => x.total))} color="bg-teal-500" />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card title="Kasus Perlindungan Aktif" href="/perlindungan">
            {caseList.length === 0 ? (
              <EmptyState title="Tidak ada kasus aktif" text="Semua kasus perlindungan telah ditangani." />
            ) : (
              <ul className="divide-y divide-slate-100">
                {caseList.map((c) => (
                  <li key={c.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-sm font-semibold text-slate-900">
                        {String(c.childName)} <span className="font-normal text-slate-400">·</span> {String(c.type)}
                      </p>
                      <div className="flex shrink-0 gap-2">
                        <Badge value={String(c.severity)} />
                        <span className="hidden sm:inline-flex">
                          <Badge value={String(c.status)} />
                        </span>
                      </div>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{String(c.description)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        <Card title="Jadwal Kesehatan" href="/kesehatan">
          {upcoming.length === 0 ? (
            <EmptyState title="Belum ada jadwal" text="Tidak ada pemeriksaan terjadwal." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {upcoming.slice(0, 5).map((h) => (
                <li key={h.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-sky-50 text-sky-600">
                    <Icon name="calendar" className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">{String(h.childName)}</p>
                    <p className="truncate text-xs text-slate-500">
                      {String(h.type)} · {formatDate(h.checkDate as string)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Anak Asuh Aktif per Jenjang Pendidikan">
        <div className="grid gap-x-8 gap-y-3 p-5 sm:grid-cols-2 lg:grid-cols-3">
          {eduGroups.map((g) => (
            <Bar key={g.e} label={g.e} value={g.n} max={eduMax} color="bg-emerald-500" />
          ))}
        </div>
      </Card>
    </div>
  );
}
