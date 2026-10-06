import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, EmptyState, Icon } from "@/components/ui";
import { getResource, listResource } from "@/lib/data";
import { calcAge, formatDate, formatRupiah, initials } from "@/lib/format";

export const metadata = { title: "Profil Anak — SIMPA Harapan" };

function Info({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm text-slate-800">{value || "—"}</dd>
    </div>
  );
}

function Section({ title, href, children }: { title: string; href: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="font-semibold text-slate-900">{title}</h2>
        <Link href={href} className="text-xs font-semibold text-teal-700 hover:underline">
          Kelola
        </Link>
      </div>
      {children}
    </section>
  );
}

export default async function ChildDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const childId = Number(id);
  if (!Number.isInteger(childId)) notFound();
  const child = await getResource("children", childId);
  if (!child) notFound();

  const [needs, cases, health] = await Promise.all([
    listResource("needs"),
    listResource("cases"),
    listResource("checkups"),
  ]);
  const myNeeds = needs.filter((n) => n.childId === childId);
  const myCases = cases.filter((c) => c.childId === childId);
  const myHealth = health.filter((h) => h.childId === childId);
  const female = child.gender === "Perempuan";

  return (
    <div className="space-y-6">
      <Link href="/anak" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-teal-700">
        ← Kembali ke Data Anak
      </Link>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div
            className={`grid h-20 w-20 shrink-0 place-items-center rounded-2xl text-2xl font-bold ${
              female ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"
            }`}
          >
            {initials(String(child.fullName))}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{String(child.fullName)}</h1>
            <p className="mt-1 text-sm text-slate-500">
              {String(child.gender)} · {calcAge(String(child.birthDate))} · {String(child.room ?? "Kamar belum ditentukan")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Badge value={String(child.status)} />
              <Badge value={String(child.orphanType)} tone="violet" />
              {child.bloodType && <Badge value={`Gol. darah ${child.bloodType}`} tone="rose" />}
            </div>
          </div>
        </div>

        <dl className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
          <Info label="Tempat, Tgl Lahir" value={`${child.birthPlace ?? "—"}, ${formatDate(child.birthDate as string)}`} />
          <Info label="Masuk Panti" value={formatDate(child.entryDate as string)} />
          <Info label="Pendidikan" value={child.education as string} />
          <Info label="Sekolah" value={child.schoolName as string} />
        </dl>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <Info label="Latar Belakang" value={child.background as string} />
          <Info label="Catatan Kesehatan" value={child.healthNotes as string} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section title={`Kebutuhan Dasar (${myNeeds.length})`} href="/kebutuhan">
          {myNeeds.length === 0 ? (
            <EmptyState title="Belum ada kebutuhan" text="Belum ada kebutuhan dasar tercatat." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {myNeeds.map((n) => (
                <li key={n.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{String(n.item)}</p>
                    <Badge value={String(n.status)} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {String(n.category)} · {formatRupiah(n.estimatedCost as number | null)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={`Perlindungan (${myCases.length})`} href="/perlindungan">
          {myCases.length === 0 ? (
            <EmptyState title="Tidak ada kasus" text="Belum ada kasus perlindungan untuk anak ini." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {myCases.map((c) => (
                <li key={c.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{String(c.type)}</p>
                    <Badge value={String(c.status)} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatDate(c.reportedDate as string)} · Risiko {String(c.severity).toLowerCase()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title={`Kesehatan (${myHealth.length})`} href="/kesehatan">
          {myHealth.length === 0 ? (
            <EmptyState title="Belum ada catatan" text="Belum ada catatan kesehatan." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {myHealth.map((h) => (
                <li key={h.id} className="px-5 py-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-900">{String(h.type)}</p>
                    <Badge value={String(h.status)} />
                  </div>
                  <p className="mt-0.5 text-xs text-slate-500">
                    <Icon name="calendar" className="mr-1 inline h-3 w-3" />
                    {formatDate(h.checkDate as string)}
                    {h.diagnosis ? ` · ${String(h.diagnosis)}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Section>
      </div>
    </div>
  );
}
