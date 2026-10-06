import ResourceManager from "@/components/ResourceManager";
import { listChildOptions, listResource } from "@/lib/data";

export const metadata = { title: "Data Anak — SIMPA Harapan" };

export default async function Page() {
  const [rows, childOptions] = await Promise.all([listResource("children"), listChildOptions()]);
  return <ResourceManager resource="children" initialRows={rows} childOptions={childOptions} />;
}
