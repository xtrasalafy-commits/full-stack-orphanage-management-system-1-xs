"use client";

import Link from "next/link";
import { useCallback, useMemo, useState, type ReactNode } from "react";
import { Badge, EmptyState, Icon, Modal, Skeleton, Spinner, useToast } from "@/components/ui";
import { calcAge, formatDate, formatRupiah, initials, todayISO, toneFor } from "@/lib/format";
import { resources, type Field, type ResourceKey, type ResourceMeta, type Row } from "@/lib/resources";

type ChildOption = { id: number; name: string };
type Col = { label: string; render: (r: Row, ctx: ColCtx) => ReactNode };
type ColCtx = { onStatus: (row: Row, value: string) => void; meta: ResourceMeta; disabled: boolean };

const str = (v: unknown) => (v === null || v === undefined ? "" : String(v));

function StatusSelect({ row, ctx }: { row: Row; ctx: ColCtx }) {
  const value = str(row[ctx.meta.statusField]);
  const tone = toneFor(value);
  const tones: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    sky: "bg-sky-50 text-sky-700 ring-sky-600/20",
    amber: "bg-amber-50 text-amber-800 ring-amber-600/25",
    rose: "bg-rose-50 text-rose-700 ring-rose-600/20",
    violet: "bg-violet-50 text-violet-700 ring-violet-600/20",
    slate: "bg-slate-100 text-slate-700 ring-slate-500/20",
  };
  return (
    <select
      value={value}
      disabled={ctx.disabled}
      onChange={(e) => ctx.onStatus(row, e.target.value)}
      aria-label="Ubah status"
      className={`cursor-pointer rounded-full border-0 py-0.5 pl-2.5 pr-6 text-xs font-medium ring-1 ring-inset focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:cursor-wait ${tones[tone]}`}
    >
      {ctx.meta.statusOptions.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

const Sub = ({ children }: { children: ReactNode }) => <div className="text-xs text-slate-500">{children}</div>;

const columns: Record<ResourceKey, Col[]> = {
  children: [
    {
      label: "Nama",
      render: (r) => (
        <div className="flex items-center gap-3">
          <div
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-bold ${
              r.gender === "Perempuan" ? "bg-rose-100 text-rose-700" : "bg-sky-100 text-sky-700"
            }`}
          >
            {initials(str(r.fullName))}
          </div>
          <div className="min-w-0">
            {r.id > 0 ? (
              <Link href={`/anak/${r.id}`} className="font-semibold text-slate-900 hover:text-teal-700 hover:underline">
                {str(r.fullName)}
              </Link>
            ) : (
              <span className="font-semibold text-slate-900">{str(r.fullName)}</span>
            )}
            <Sub>
              {str(r.gender)} · {calcAge(str(r.birthDate))}
            </Sub>
          </div>
        </div>
      ),
    },
    { label: "Orang Tua", render: (r) => <Badge value={str(r.orphanType)} tone="violet" /> },
    {
      label: "Pendidikan",
      render: (r) => (
        <div>
          <div className="text-slate-800">{str(r.education) || "—"}</div>
          {r.schoolName ? <Sub>{str(r.schoolName)}</Sub> : null}
        </div>
      ),
    },
    { label: "Kamar", render: (r) => <span className="text-slate-700">{str(r.room) || "—"}</span> },
    { label: "Masuk", render: (r) => <span className="text-slate-700">{formatDate(str(r.entryDate))}</span> },
    { label: "Status", render: (r, c) => <StatusSelect row={r} ctx={c} /> },
  ],
  needs: [
    {
      label: "Kebutuhan",
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{str(r.item)}</div>
          <Sub>{str(r.category)}</Sub>
        </div>
      ),
    },
    { label: "Anak", render: (r) => <span className="text-slate-700">{str(r.childName) || "—"}</span> },
    { label: "Prioritas", render: (r) => <Badge value={str(r.priority)} /> },
    { label: "Biaya", render: (r) => <span className="text-slate-700">{formatRupiah(r.estimatedCost as number | null)}</span> },
    {
      label: "Target",
      render: (r) => {
        const late = r.dueDate && str(r.dueDate) < todayISO() && r.status !== "Terpenuhi";
        return (
          <span className={late ? "font-medium text-rose-600" : "text-slate-700"}>
            {formatDate(str(r.dueDate))}
            {late ? <Sub>Terlambat</Sub> : null}
          </span>
        );
      },
    },
    { label: "Status", render: (r, c) => <StatusSelect row={r} ctx={c} /> },
  ],
  cases: [
    {
      label: "Kasus",
      render: (r) => (
        <div className="max-w-xs">
          <div className="font-semibold text-slate-900">{str(r.type)}</div>
          <Sub>
            <span className="line-clamp-1">{str(r.description)}</span>
          </Sub>
        </div>
      ),
    },
    { label: "Anak", render: (r) => <span className="text-slate-700">{str(r.childName) || "—"}</span> },
    { label: "Risiko", render: (r) => <Badge value={str(r.severity)} /> },
    { label: "Dilaporkan", render: (r) => <span className="text-slate-700">{formatDate(str(r.reportedDate))}</span> },
    { label: "Penanggung Jawab", render: (r) => <span className="text-slate-700">{str(r.handler) || "—"}</span> },
    { label: "Status", render: (r, c) => <StatusSelect row={r} ctx={c} /> },
  ],
  checkups: [
    {
      label: "Pemeriksaan",
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-900">{str(r.type)}</div>
          <Sub>{str(r.handler) || "—"}</Sub>
        </div>
      ),
    },
    { label: "Anak", render: (r) => <span className="text-slate-700">{str(r.childName) || "—"}</span> },
    { label: "Tanggal", render: (r) => <span className="text-slate-700">{formatDate(str(r.checkDate))}</span> },
    {
      label: "Hasil",
      render: (r) => (
        <div className="max-w-[16rem]">
          <div className="line-clamp-1 text-slate-800">{str(r.diagnosis) || "—"}</div>
          {r.weightKg || r.heightCm ? (
            <Sub>
              {r.weightKg ? `${r.weightKg} kg` : ""}
              {r.weightKg && r.heightCm ? " · " : ""}
              {r.heightCm ? `${r.heightCm} cm` : ""}
            </Sub>
          ) : null}
        </div>
      ),
    },
    { label: "Berikutnya", render: (r) => <span className="text-slate-700">{formatDate(str(r.nextCheckDate))}</span> },
    { label: "Status", render: (r, c) => <StatusSelect row={r} ctx={c} /> },
  ],
};

/* ---------- Form ---------- */
function RecordForm({
  meta,
  initial,
  childOptions,
  onSubmit,
  onCancel,
}: {
  meta: ResourceMeta;
  initial: Row | null;
  childOptions: ChildOption[];
  onSubmit: (values: Record<string, string>) => void;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of meta.fields) {
      v[f.name] = initial ? str(initial[f.name]) : f.defaultValue ?? "";
    }
    if (!initial) {
      const today = todayISO();
      if (meta.key === "children") v.entryDate = today;
      if (meta.key === "cases") v.reportedDate = today;
      if (meta.key === "checkups") v.checkDate = today;
    }
    return v;
  });
  const set = (name: string, value: string) => setValues((v) => ({ ...v, [name]: value }));

  const renderField = (f: Field) => {
    const common = {
      id: `f-${f.name}`,
      required: f.required,
      value: values[f.name] ?? "",
      className: "input",
    };
    switch (f.type) {
      case "textarea":
        return <textarea {...common} rows={3} placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />;
      case "select":
        return (
          <select {...common} onChange={(e) => set(f.name, e.target.value)}>
            {!f.required && <option value="">— Pilih —</option>}
            {f.required && !values[f.name] && <option value="">— Pilih —</option>}
            {f.options?.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        );
      case "child":
        return (
          <select {...common} onChange={(e) => set(f.name, e.target.value)}>
            <option value="">— Pilih anak —</option>
            {childOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        );
      case "date":
        return <input {...common} type="date" onChange={(e) => set(f.name, e.target.value)} />;
      case "number":
        return (
          <input {...common} type="number" min={0} step="any" placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />
        );
      default:
        return <input {...common} type="text" placeholder={f.placeholder} onChange={(e) => set(f.name, e.target.value)} />;
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(values);
      }}
    >
      <div className="grid gap-4 p-5 sm:grid-cols-2">
        {meta.fields.map((f) => (
          <div key={f.name} className={f.full || f.type === "textarea" ? "sm:col-span-2" : ""}>
            <label htmlFor={`f-${f.name}`} className="mb-1.5 block text-sm font-medium text-slate-700">
              {f.label}
              {f.required && <span className="text-rose-500"> *</span>}
            </label>
            {renderField(f)}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 flex justify-end gap-2 border-t border-slate-100 bg-white px-5 py-4">
        <button type="button" onClick={onCancel} className="btn-ghost">
          Batal
        </button>
        <button type="submit" className="btn-primary">
          {initial ? "Simpan Perubahan" : `Tambah ${meta.singular}`}
        </button>
      </div>
    </form>
  );
}

/* ---------- Manager ---------- */
export default function ResourceManager({
  resource,
  initialRows,
  childOptions,
}: {
  resource: ResourceKey;
  initialRows: Row[];
  childOptions: ChildOption[];
}) {
  const meta = resources[resource];
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [pending, setPending] = useState<Set<number>>(new Set());
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState<{ row: Row | null } | null>(null);
  const [toDelete, setToDelete] = useState<Row | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const childName = useCallback(
    (id: unknown) => childOptions.find((c) => c.id === Number(id))?.name ?? null,
    [childOptions],
  );

  const markPending = (id: number, on: boolean) =>
    setPending((p) => {
      const n = new Set(p);
      if (on) n.add(id);
      else n.delete(id);
      return n;
    });

  const normalise = (values: Record<string, string>): Partial<Row> => {
    const out: Record<string, string | number | null> = {};
    for (const f of meta.fields) {
      const v = (values[f.name] ?? "").trim();
      if (v === "") out[f.name] = null;
      else if (f.type === "number" || f.type === "child") out[f.name] = Number(v);
      else out[f.name] = v;
    }
    if (resource !== "children") out.childName = childName(out.childId);
    return out as Partial<Row>;
  };

  async function request(url: string, method: string, body?: unknown) {
    try {
      const res = await fetch(url, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) return { ok: false as const, error: (data.error as string) ?? "Terjadi kesalahan" };
      return { ok: true as const, data };
    } catch {
      return { ok: false as const, error: "Tidak dapat terhubung ke server" };
    }
  }

  async function save(values: Record<string, string>) {
    const editing = modal?.row ?? null;
    setModal(null);
    const optimistic = normalise(values);

    if (editing) {
      const previous = editing;
      setRows((rs) => rs.map((r) => (r.id === editing.id ? ({ ...r, ...optimistic } as Row) : r)));
      markPending(editing.id, true);
      const body: Record<string, string> = values;
      const result = await request(`/api/${resource}/${editing.id}`, "PATCH", body);
      markPending(editing.id, false);
      if (result.ok) {
        setRows((rs) => rs.map((r) => (r.id === editing.id ? (result.data as Row) : r)));
        toast(`${meta.singular} berhasil diperbarui`);
      } else {
        setRows((rs) => rs.map((r) => (r.id === editing.id ? previous : r)));
        toast(result.error, "error");
      }
    } else {
      const tempId = -Math.floor(Math.random() * 1e9) - 1;
      setRows((rs) => [{ id: tempId, ...optimistic } as Row, ...rs]);
      markPending(tempId, true);
      const result = await request(`/api/${resource}`, "POST", values);
      markPending(tempId, false);
      if (result.ok) {
        setRows((rs) => rs.map((r) => (r.id === tempId ? (result.data as Row) : r)));
        toast(`${meta.singular} berhasil ditambahkan`);
      } else {
        setRows((rs) => rs.filter((r) => r.id !== tempId));
        toast(result.error, "error");
      }
    }
  }

  async function changeStatus(row: Row, value: string) {
    const field = meta.statusField;
    const previous = row[field];
    if (previous === value) return;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, [field]: value } : r)));
    markPending(row.id, true);
    const result = await request(`/api/${resource}/${row.id}`, "PATCH", { [field]: value });
    markPending(row.id, false);
    if (result.ok) {
      setRows((rs) => rs.map((r) => (r.id === row.id ? (result.data as Row) : r)));
      toast(`Status diubah menjadi “${value}”`);
    } else {
      setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, [field]: previous } : r)));
      toast(result.error, "error");
    }
  }

  async function confirmDelete() {
    const row = toDelete;
    if (!row) return;
    setDeleting(true);
    const index = rows.findIndex((r) => r.id === row.id);
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    setToDelete(null);
    const result = await request(`/api/${resource}/${row.id}`, "DELETE");
    setDeleting(false);
    if (result.ok) {
      toast(`${meta.singular} dihapus`);
    } else {
      setRows((rs) => {
        const next = [...rs];
        next.splice(Math.min(index, next.length), 0, row);
        return next;
      });
      toast(result.error, "error");
    }
  }

  async function refresh() {
    setRefreshing(true);
    const result = await request(`/api/${resource}`, "GET");
    setRefreshing(false);
    if (result.ok) {
      setRows(result.data as Row[]);
      toast("Data diperbarui");
    } else toast(result.error, "error");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filter && str(r[meta.statusField]) !== filter) return false;
      if (!q) return true;
      return meta.searchFields.some((f) => str(r[f]).toLowerCase().includes(q));
    });
  }, [rows, query, filter, meta]);

  const cols = columns[resource];
  const hasFilters = query !== "" || filter !== "";
  const rowTitle = (r: Row) => str(r.fullName || r.item || r.type || "data ini");

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{meta.title}</h1>
          <p className="mt-1 text-sm text-slate-500">{meta.description}</p>
        </div>
        <button onClick={() => setModal({ row: null })} className="btn-primary self-start sm:self-auto">
          <Icon name="plus" className="h-4 w-4" />
          Tambah {meta.singular}
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder={`Cari ${meta.title.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <select className="input sm:w-56" value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter status">
            <option value="">Semua status</option>
            {meta.statusOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <button onClick={refresh} disabled={refreshing} className="btn-ghost" title="Muat ulang data">
            {refreshing ? <Spinner /> : <span>Muat ulang</span>}
          </button>
        </div>

        {refreshing ? (
          <div className="space-y-3 p-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : rows.length === 0 ? (
          <EmptyState
            title={meta.emptyTitle}
            text={meta.emptyText}
            action={
              <button onClick={() => setModal({ row: null })} className="btn-primary">
                <Icon name="plus" className="h-4 w-4" />
                Tambah {meta.singular}
              </button>
            }
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="Tidak ada hasil"
            text="Tidak ada data yang cocok dengan pencarian atau filter Anda."
            action={
              hasFilters ? (
                <button
                  onClick={() => {
                    setQuery("");
                    setFilter("");
                  }}
                  className="btn-ghost"
                >
                  Reset pencarian
                </button>
              ) : undefined
            }
          />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/60 text-xs uppercase tracking-wide text-slate-500">
                    {cols.map((c) => (
                      <th key={c.label} className="whitespace-nowrap px-4 py-3 font-semibold">
                        {c.label}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-right font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((r) => {
                    const busy = pending.has(r.id);
                    const ctx: ColCtx = { onStatus: changeStatus, meta, disabled: busy };
                    return (
                      <tr key={r.id} className={`transition hover:bg-slate-50/70 ${busy ? "opacity-60" : ""}`}>
                        {cols.map((c) => (
                          <td key={c.label} className="px-4 py-3 align-middle">
                            {c.render(r, ctx)}
                          </td>
                        ))}
                        <td className="whitespace-nowrap px-4 py-3 text-right">
                          {busy ? (
                            <Spinner className="ml-auto h-4 w-4 text-teal-600" />
                          ) : (
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => setModal({ row: r })}
                                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-teal-700"
                                aria-label="Ubah"
                              >
                                <Icon name="edit" className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => setToDelete(r)}
                                className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                                aria-label="Hapus"
                              >
                                <Icon name="trash" className="h-4 w-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <ul className="divide-y divide-slate-100 md:hidden">
              {filtered.map((r) => {
                const busy = pending.has(r.id);
                const ctx: ColCtx = { onStatus: changeStatus, meta, disabled: busy };
                const [first, ...rest] = cols;
                return (
                  <li key={r.id} className={`space-y-3 p-4 ${busy ? "opacity-60" : ""}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">{first.render(r, ctx)}</div>
                      {busy ? (
                        <Spinner className="h-4 w-4 shrink-0 text-teal-600" />
                      ) : (
                        <div className="flex shrink-0 gap-1">
                          <button
                            onClick={() => setModal({ row: r })}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                            aria-label="Ubah"
                          >
                            <Icon name="edit" className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setToDelete(r)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                            aria-label="Hapus"
                          >
                            <Icon name="trash" className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      {rest.map((c) => (
                        <div key={c.label}>
                          <dt className="text-xs text-slate-400">{c.label}</dt>
                          <dd className="mt-0.5">{c.render(r, ctx)}</dd>
                        </div>
                      ))}
                    </dl>
                  </li>
                );
              })}
            </ul>
            <div className="border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
              Menampilkan {filtered.length} dari {rows.length} data
            </div>
          </>
        )}
      </div>

      <Modal
        open={!!modal}
        onClose={() => setModal(null)}
        wide
        title={modal?.row ? `Ubah ${meta.singular}` : `Tambah ${meta.singular}`}
      >
        {modal && (
          <RecordForm
            key={modal.row?.id ?? "new"}
            meta={meta}
            initial={modal.row}
            childOptions={childOptions}
            onSubmit={save}
            onCancel={() => setModal(null)}
          />
        )}
      </Modal>

      <Modal open={!!toDelete} onClose={() => !deleting && setToDelete(null)} title="Hapus data?">
        <div className="p-5">
          <div className="flex gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
              <Icon name="alert" className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-600">
              Anda akan menghapus <strong className="text-slate-900">{toDelete ? rowTitle(toDelete) : ""}</strong>.
              {resource === "children"
                ? " Seluruh catatan kebutuhan, perlindungan, dan kesehatan anak ini juga akan terhapus."
                : ""}{" "}
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-2">
            <button className="btn-ghost" onClick={() => setToDelete(null)}>
              Batal
            </button>
            <button
              onClick={confirmDelete}
              className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
