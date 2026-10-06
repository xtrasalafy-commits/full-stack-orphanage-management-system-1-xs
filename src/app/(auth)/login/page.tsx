import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { ensureSeed } from "@/db/seed";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const metadata = { title: "Masuk — SIMPA Harapan" };

export default async function LoginPage() {
  await ensureSeed();
  if (await getCurrentUser()) redirect("/dashboard");
  return <AuthForm mode="login" />;
}
