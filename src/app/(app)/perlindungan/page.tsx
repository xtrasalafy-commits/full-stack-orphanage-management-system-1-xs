import ResourceManager from "@/components/ResourceManager";
import { listChildOptions, listResource } from "@/lib/data";

export const metadata = { title: "Perlindungan Anak — SIMPA Harapan" };

export default async function Page() {
  const [rows, childOptions] = await Promise.all([listResource("cases"), listChildOptions()]);
  return <ResourceManager resource="cases" initialRows={rows} childOptions={childOptions} />;
}
