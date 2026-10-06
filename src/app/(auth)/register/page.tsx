import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { ensureSeed } from "@/db/seed";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Daftar — SIMPA Harapan" };

export default async function RegisterPage() {
  await ensureSeed();
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="register" />;
}
