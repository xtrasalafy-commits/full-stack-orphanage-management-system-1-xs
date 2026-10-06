import ResourceManager from "@/components/ResourceManager";
import { listChildOptions, listResource } from "@/lib/data";

export const metadata = { title: "Kebutuhan Dasar — SIMPA Harapan" };

export default async function Page() {
  const [rows, childOptions] = await Promise.all([listResource("needs"), listChildOptions()]);
  return <ResourceManager resource="needs" initialRows={rows} childOptions={childOptions} />;
}
