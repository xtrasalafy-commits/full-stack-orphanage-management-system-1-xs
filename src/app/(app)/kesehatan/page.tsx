import ResourceManager from "@/components/ResourceManager";
import { listChildOptions, listResource } from "@/lib/data";

export const metadata = { title: "Kesehatan — SIMPA Harapan" };

export default async function Page() {
  const [rows, childOptions] = await Promise.all([listResource("checkups"), listChildOptions()]);
  return <ResourceManager resource="checkups" initialRows={rows} childOptions={childOptions} />;
}
