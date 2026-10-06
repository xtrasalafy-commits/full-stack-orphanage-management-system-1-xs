import { eq } from "drizzle-orm";
import { db } from "@/db";
import { getCurrentUser } from "@/lib/auth";
import { getResource, tableFor } from "@/lib/data";
import { isResourceKey, parsePayload, resources } from "@/lib/resources";

export const dynamic = "force-dynamic";

type Ctx = { params: Promise<{ resource: string; id: string }> };

async function guard(ctx: Ctx) {
  const { resource, id } = await ctx.params;
  const numId = Number(id);
  if (!isResourceKey(resource) || !Number.isInteger(numId)) {
    return { res: Response.json({ error: "Tidak ditemukan" }, { status: 404 }) } as const;
  }
  if (!(await getCurrentUser())) {
    return { res: Response.json({ error: "Belum masuk" }, { status: 401 }) } as const;
  }
  return { resource, id: numId } as const;
}

export async function GET(_req: Request, ctx: Ctx) {
  const g = await guard(ctx);
  if ("res" in g) return g.res;
  const row = await getResource(g.resource, g.id);
  if (!row) return Response.json({ error: "Tidak ditemukan" }, { status: 404 });
  return Response.json(row);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const g = await guard(ctx);
  if ("res" in g) return g.res;

  const body = await req.json().catch(() => null);
  const { data, error } = parsePayload(resources[g.resource], body, true);
  if (error) return Response.json({ error }, { status: 400 });
  if (Object.keys(data).length === 0) return Response.json({ error: "Tidak ada perubahan" }, { status: 400 });

  try {
    const table = tableFor(g.resource);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updated = await db.update(table).set(data as any).where(eq(table.id, g.id)).returning({ id: table.id });
    if (updated.length === 0) return Response.json({ error: "Tidak ditemukan" }, { status: 404 });
    return Response.json(await getResource(g.resource, g.id));
  } catch {
    return Response.json({ error: "Gagal memperbarui data" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const g = await guard(ctx);
  if ("res" in g) return g.res;
  const table = tableFor(g.resource);
  await db.delete(table).where(eq(table.id, g.id));
  return Response.json({ ok: true });
}
