import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { getResource, listResource, tableFor } from "@/lib/data";
import { isResourceKey, parsePayload, resources } from "@/lib/resources";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const { resource } = await params;
  if (!isResourceKey(resource)) return Response.json({ error: "Tidak ditemukan" }, { status: 404 });
  if (!(await getCurrentUser())) return Response.json({ error: "Belum masuk" }, { status: 401 });
  return Response.json(await listResource(resource));
}

export async function POST(req: Request, { params }: Ctx) {
  const { resource } = await params;
  if (!isResourceKey(resource)) return Response.json({ error: "Tidak ditemukan" }, { status: 404 });
  if (!(await getCurrentUser())) return Response.json({ error: "Belum masuk" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const { data, error } = parsePayload(resources[resource], body);
  if (error) return Response.json({ error }, { status: 400 });

  try {
    const table = tableFor(resource);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [inserted] = await db.insert(table).values(data as any).returning({ id: table.id });
    return Response.json(await getResource(resource, inserted.id), { status: 201 });
  } catch (e) {
    const msg = e instanceof Error && /foreign key/i.test(e.message) ? "Anak tidak ditemukan" : "Gagal menyimpan data";
    return Response.json({ error: msg }, { status: 400 });
  }
}
