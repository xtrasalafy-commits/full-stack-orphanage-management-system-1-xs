import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { createSession, isSecureRequest, verifyPassword } from "@/lib/auth";
import { ensureSeed } from "@/db/seed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: string; password?: string } | null;
  const email = body?.email?.trim().toLowerCase();
  const password = body?.password ?? "";
  if (!email || !password) {
    return Response.json({ error: "Email dan kata sandi wajib diisi" }, { status: 400 });
  }
  await ensureSeed();
  const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return Response.json({ error: "Email atau kata sandi salah" }, { status: 401 });
  }
  await createSession(user.id, isSecureRequest(req));
  return Response.json({ ok: true });
}
