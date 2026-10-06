import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, hashPassword, isSecureRequest } from "@/lib/auth";
import { ensureSeed } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    name?: string;
    email?: string;
    password?: string;
  } | null;
  const name = body?.name?.trim();
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";
  if (!name || !email || !password) {
    return Response.json({ error: "Semua kolom wajib diisi" }, { status: 400 });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return Response.json({ error: "Format email tidak valid" }, { status: 400 });
  }
  if (password.length < 6) {
    return Response.json({ error: "Kata sandi minimal 6 karakter" }, { status: 400 });
  }
  await ensureSeed();
  const [existing] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing) {
    return Response.json({ error: "Email sudah terdaftar" }, { status: 409 });
  }
  const [user] = await db
    .insert(users)
    .values({ name, email, passwordHash: hashPassword(password), role: "pengasuh" })
    .returning({ id: users.id });
  await createSession(user.id, isSecureRequest(req));
  return Response.json({ ok: true }, { status: 201 });
}
